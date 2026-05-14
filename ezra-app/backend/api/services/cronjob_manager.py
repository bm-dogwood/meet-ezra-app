"""CronJob manager service for auto-provisioning K8s CronJobs.

Creates, updates, suspends, unsuspends, and removes CronJobs in the
appropriate namespace based on ReportSchedule lifecycle events.

Environment is controlled by the ``EZRA_ENV`` environment variable:
- ``prod``  → namespace ``ezrabot``, production URLs
- anything else (including unset) → namespace ``dev-ezrabot``, dev URLs
"""

import hashlib
import logging
import os
import tempfile

from kubernetes import client, config
from kubernetes.client.exceptions import ApiException

logger = logging.getLogger(__name__)

EZRA_ENV = os.environ.get("EZRA_ENV", "dev").lower()
_IS_PROD = EZRA_ENV == "prod"

NAMESPACE = "ezrabot" if _IS_PROD else "dev-ezrabot"
CONTAINER_IMAGE_FALLBACK = (
    "us-east1-docker.pkg.dev/ezrabot-481216/ezrabot-repo/ezra-backend:latest"
)
_ADMIN_URL = "https://api.meetezra.bot/admin" if _IS_PROD else "https://dev-api-meetezra.hachiai.com/admin"
_FRONTEND_URL = "https://meetezra.bot/login" if _IS_PROD else "https://dev-meetezra.hachiai.com/login"

# GKE cluster details for out-of-cluster auth
_GKE_PROJECT = "ezrabot-481216"
_GKE_CLUSTER = "ezrabot-prod-gke"
_GKE_REGION = "us-east1"
_GCP_SA_KEY_PATH = os.environ.get("GCP_SA_KEY_PATH", "")


class CronJobManager:
    """Manages K8s CronJobs for report schedules via the ``kubernetes`` client."""

    def __init__(self):
        self.batch_api = None
        try:
            config.load_incluster_config()
            self.batch_api = client.BatchV1Api()
            logger.info("CronJobManager initialized (in-cluster) env=%s namespace=%s", EZRA_ENV, NAMESPACE)
            return
        except config.ConfigException:
            logger.debug("Not running in-cluster, trying alternative auth...")

        # Try loading existing kubeconfig (e.g. developer already ran gcloud get-credentials)
        try:
            config.load_kube_config()
            self.batch_api = client.BatchV1Api()
            logger.info("CronJobManager initialized (kubeconfig) env=%s namespace=%s", EZRA_ENV, NAMESPACE)
            return
        except config.ConfigException:
            logger.debug("No kubeconfig found, trying GCP service account...")

        # Fall back to GCP service account key → fetch GKE credentials programmatically
        sa_key_path = _GCP_SA_KEY_PATH
        if not sa_key_path:
            # Check common project-relative path
            project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            candidate = os.path.join(project_root, "gcp-sa-key.json")
            if os.path.exists(candidate):
                sa_key_path = candidate

        if sa_key_path and os.path.exists(sa_key_path):
            try:
                self._load_gke_credentials(sa_key_path)
                self.batch_api = client.BatchV1Api()
                logger.info(
                    "CronJobManager initialized (GCP SA key) env=%s namespace=%s",
                    EZRA_ENV, NAMESPACE,
                )
                return
            except Exception:
                logger.exception("Failed to load GKE credentials from service account key")

        logger.warning(
            "No K8s auth available — CronJob provisioning will be skipped. "
            "Schedules will still be saved to the database."
        )

    @staticmethod
    def _load_gke_credentials(sa_key_path: str) -> None:
        """Authenticate to GKE using a GCP service account JSON key."""
        import google.auth.transport.requests
        from google.oauth2 import service_account
        from google.cloud.container_v1 import ClusterManagerClient

        credentials = service_account.Credentials.from_service_account_file(
            sa_key_path,
            scopes=["https://www.googleapis.com/auth/cloud-platform"],
        )
        credentials.refresh(google.auth.transport.requests.Request())

        cluster_manager = ClusterManagerClient(credentials=credentials)
        cluster_path = (
            f"projects/{_GKE_PROJECT}/locations/{_GKE_REGION}/clusters/{_GKE_CLUSTER}"
        )
        cluster = cluster_manager.get_cluster(name=cluster_path)

        ca_cert = cluster.master_auth.cluster_ca_certificate
        endpoint = cluster.endpoint

        # Write CA cert to a temp file for the k8s client
        ca_cert_file = tempfile.NamedTemporaryFile(delete=False, suffix=".crt")
        import base64
        ca_cert_file.write(base64.b64decode(ca_cert))
        ca_cert_file.close()

        configuration = client.Configuration()
        configuration.host = f"https://{endpoint}"
        configuration.ssl_ca_cert = ca_cert_file.name
        configuration.api_key = {"authorization": f"Bearer {credentials.token}"}
        client.Configuration.set_default(configuration)

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _get_current_image(self) -> str:
        """Return the image used by the running backend deployment, falling
        back to the hardcoded default if the lookup fails."""
        try:
            apps_v1 = client.AppsV1Api()
            dep = apps_v1.read_namespaced_deployment(name="backend", namespace=NAMESPACE)
            return dep.spec.template.spec.containers[0].image
        except Exception:
            logger.warning("Could not read backend deployment image, using fallback")
            return CONTAINER_IMAGE_FALLBACK

    @staticmethod
    def cron_key_to_name(cron_key: str) -> str:
        """Return a DNS-safe CronJob name derived from *cron_key*."""
        h = hashlib.sha256(cron_key.encode()).hexdigest()[:12]
        return f"report-schedule-{h}"

    @staticmethod
    def _build_cron_key(cron_expression: str, timezone: str) -> str:
        return f"{cron_expression}|{timezone}"

    def _has_other_active_schedules(self, cron_key: str, exclude_id: int | None = None) -> bool:
        """Return ``True`` if at least one active schedule shares *cron_key*."""
        from api.models import ReportSchedule

        cron_expression, timezone = cron_key.split("|", 1)
        qs = ReportSchedule.objects.filter(
            cron_expression=cron_expression,
            timezone=timezone,
            is_active=True,
        )
        if exclude_id is not None:
            qs = qs.exclude(pk=exclude_id)
        return qs.exists()

    def _build_cronjob_manifest(
        self,
        name: str,
        cron_expression: str,
        timezone: str,
        utc_cron: str,
    ) -> client.V1CronJob:
        """Build a V1CronJob manifest mirroring the existing template."""

        # --- Environment variables (same as cronjob-report-schedule.yaml) ---
        plain_env = [
            client.V1EnvVar(name="DEBUG", value="False"),
            client.V1EnvVar(name="EZRA_ENV", value=EZRA_ENV),
            client.V1EnvVar(name="EMAIL_HOST", value="smtp.gmail.com"),
            client.V1EnvVar(name="EMAIL_PORT", value="587"),
            client.V1EnvVar(
                name="ADMIN_URL",
                value=_ADMIN_URL,
            ),
            client.V1EnvVar(
                name="FRONTEND_URL",
                value=_FRONTEND_URL,
            ),
        ]

        def _secret_env(env_name: str, key: str) -> client.V1EnvVar:
            return client.V1EnvVar(
                name=env_name,
                value_from=client.V1EnvVarSource(
                    secret_key_ref=client.V1SecretKeySelector(
                        name="backend-secrets",
                        key=key,
                    ),
                ),
            )

        secret_env = [
            _secret_env("SECRET_KEY", "SECRET_KEY"),
            _secret_env("DATABASE_URL", "DATABASE_URL"),
            _secret_env("INGESTION_API_KEY", "INGESTION_API_KEY"),
            _secret_env("EMAIL_HOST_USER", "EMAIL_HOST_USER"),
            _secret_env("EMAIL_HOST_PASSWORD", "EMAIL_HOST_PASSWORD"),
            _secret_env("DEFAULT_FROM_EMAIL", "EMAIL_HOST_USER"),
        ]

        container = client.V1Container(
            name="send-reports",
            image=self._get_current_image(),
            image_pull_policy="Always",
            command=[
                "python",
                "manage.py",
                "send_scheduled_reports",
                "--cron-expression",
                cron_expression,
                "--timezone",
                timezone,
            ],
            env=plain_env + secret_env,
            resources=client.V1ResourceRequirements(
                requests={"cpu": "250m", "memory": "512Mi"},
                limits={"cpu": "1000m", "memory": "1Gi"},
            ),
        )

        pod_spec = client.V1PodSpec(
            containers=[container],
            restart_policy="OnFailure",
        )

        pod_template = client.V1PodTemplateSpec(
            metadata=client.V1ObjectMeta(
                labels={
                    "app": "backend",
                    "component": "report-scheduler",
                },
            ),
            spec=pod_spec,
        )

        job_spec = client.V1JobSpec(
            template=pod_template,
            backoff_limit=2,
            active_deadline_seconds=600,
        )

        cronjob_spec = client.V1CronJobSpec(
            schedule=cron_expression,
            time_zone=timezone,
            concurrency_policy="Forbid",
            successful_jobs_history_limit=3,
            failed_jobs_history_limit=3,
            job_template=client.V1JobTemplateSpec(spec=job_spec),
        )

        return client.V1CronJob(
            api_version="batch/v1",
            kind="CronJob",
            metadata=client.V1ObjectMeta(
                name=name,
                namespace=NAMESPACE,
                labels={
                    "app": "backend",
                    "component": "report-scheduler",
                },
            ),
            spec=cronjob_spec,
        )

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def ensure_cronjob(
        self,
        cron_expression: str,
        timezone: str,
        utc_cron: str,
    ) -> None:
        """Create or update the CronJob for the given cron expression + timezone."""
        if self.batch_api is None:
            logger.info("Skipping CronJob ensure (not in cluster)")
            return

        cron_key = self._build_cron_key(cron_expression, timezone)
        name = self.cron_key_to_name(cron_key)
        manifest = self._build_cronjob_manifest(
            name, cron_expression, timezone, utc_cron
        )

        try:
            self.batch_api.create_namespaced_cron_job(
                namespace=NAMESPACE, body=manifest
            )
            logger.info("Created CronJob %s", name)
        except ApiException as exc:
            if exc.status == 409:
                # Already exists — update instead.
                self.batch_api.replace_namespaced_cron_job(
                    name=name, namespace=NAMESPACE, body=manifest
                )
                logger.info("Updated CronJob %s (409 conflict on create)", name)
            else:
                logger.error("K8s API error creating CronJob %s: %s", name, exc)
                raise

    def maybe_remove_cronjob(
        self,
        cron_expression: str,
        timezone: str,
        exclude_id: int | None = None,
    ) -> None:
        """Remove the CronJob if no active schedules share this cron key."""
        if self.batch_api is None:
            logger.info("Skipping CronJob removal (not in cluster)")
            return

        cron_key = self._build_cron_key(cron_expression, timezone)

        if self._has_other_active_schedules(cron_key, exclude_id=exclude_id):
            logger.info(
                "Skipping CronJob removal — other active schedules share key %s",
                cron_key,
            )
            return

        name = self.cron_key_to_name(cron_key)
        try:
            self.batch_api.delete_namespaced_cron_job(
                name=name, namespace=NAMESPACE
            )
            logger.info("Deleted CronJob %s", name)
        except ApiException as exc:
            if exc.status == 404:
                logger.info("CronJob %s already removed (404)", name)
            else:
                logger.error("K8s API error deleting CronJob %s: %s", name, exc)
                raise

    def suspend_cronjob(
        self,
        cron_expression: str,
        timezone: str,
    ) -> None:
        """Suspend the CronJob if no other active schedules share this cron key."""
        if self.batch_api is None:
            logger.info("Skipping CronJob suspend (not in cluster)")
            return

        cron_key = self._build_cron_key(cron_expression, timezone)

        if self._has_other_active_schedules(cron_key):
            logger.info(
                "Skipping CronJob suspend — other active schedules share key %s",
                cron_key,
            )
            return

        name = self.cron_key_to_name(cron_key)
        body = {"spec": {"suspend": True}}
        try:
            self.batch_api.patch_namespaced_cron_job(
                name=name, namespace=NAMESPACE, body=body
            )
            logger.info("Suspended CronJob %s", name)
        except ApiException as exc:
            logger.error("K8s API error suspending CronJob %s: %s", name, exc)
            raise

    def unsuspend_cronjob(
        self,
        cron_expression: str,
        timezone: str,
    ) -> None:
        """Unsuspend (resume) the CronJob for this cron key."""
        if self.batch_api is None:
            logger.info("Skipping CronJob unsuspend (not in cluster)")
            return

        cron_key = self._build_cron_key(cron_expression, timezone)
        name = self.cron_key_to_name(cron_key)
        body = {"spec": {"suspend": False}}
        try:
            self.batch_api.patch_namespaced_cron_job(
                name=name, namespace=NAMESPACE, body=body
            )
            logger.info("Unsuspended CronJob %s", name)
        except ApiException as exc:
            logger.error("K8s API error unsuspending CronJob %s: %s", name, exc)
            raise

    # ------------------------------------------------------------------
    # Per-Campaign CronJob (precise scheduling)
    # ------------------------------------------------------------------

    @staticmethod
    def campaign_cronjob_name(campaign_id: int) -> str:
        return f"campaign-{campaign_id}"

    def ensure_campaign_cronjob(self, campaign_id: int, scheduled_at, timezone_str: str = 'UTC'):
        """Create a K8s CronJob that fires once at the campaign's scheduled_at time."""
        if self.batch_api is None:
            logger.info("Skipping campaign CronJob ensure (not in cluster)")
            return

        from datetime import datetime as _dt
        import zoneinfo

        # Convert scheduled_at to the campaign's timezone for cron expression
        if hasattr(scheduled_at, 'astimezone'):
            utc_dt = scheduled_at
        else:
            utc_dt = _dt.fromisoformat(str(scheduled_at))
            if utc_dt.tzinfo is None:
                utc_dt = utc_dt.replace(tzinfo=zoneinfo.ZoneInfo('UTC'))

        local_tz = zoneinfo.ZoneInfo(timezone_str)
        local_dt = utc_dt.astimezone(local_tz)

        # Build cron: minute hour day month *
        cron_expr = f"{local_dt.minute} {local_dt.hour} {local_dt.day} {local_dt.month} *"
        name = self.campaign_cronjob_name(campaign_id)

        manifest = self._build_campaign_cronjob_manifest(name, cron_expr, timezone_str, campaign_id)
        try:
            self.batch_api.create_namespaced_cron_job(namespace=NAMESPACE, body=manifest)
            logger.info("Created campaign CronJob %s schedule=%s tz=%s", name, cron_expr, timezone_str)
        except ApiException as exc:
            if exc.status == 409:
                self.batch_api.replace_namespaced_cron_job(
                    name=name, namespace=NAMESPACE, body=manifest
                )
                logger.info("Updated campaign CronJob %s", name)
            else:
                logger.error("K8s API error creating campaign CronJob %s: %s", name, exc)
                raise

    def ensure_recurring_campaign_cronjob(self, campaign):
        """Create a K8s CronJob with a recurring cron expression for a recurring campaign."""
        if self.batch_api is None:
            logger.info("Skipping recurring campaign CronJob ensure (not in cluster)")
            return

        tz = getattr(campaign, 'campaign_timezone', None) or 'UTC'
        time_str = getattr(campaign, 'recurring_time', '10:00') or '10:00'
        parts = time_str.split(':')
        minute = int(parts[0]) if len(parts) == 1 else int(parts[1])
        hour = int(parts[0])
        freq = getattr(campaign, 'recurring_frequency', 'daily') or 'daily'
        day_of_week = getattr(campaign, 'recurring_day_of_week', None)

        if freq == 'daily':
            cron_expr = f"{minute} {hour} * * *"
        elif freq == 'weekly':
            # day_of_week: 0=Mon..6=Sun in our model, cron uses 0=Sun or 1=Mon..7=Sun
            # K8s cron: 0=Sun, 1=Mon, ..., 6=Sat
            cron_dow = ((day_of_week or 0) + 1) % 7
            cron_expr = f"{minute} {hour} * * {cron_dow}"
        elif freq == 'biweekly':
            # Cron doesn't natively support biweekly; use weekly and let run_campaign handle skip logic
            cron_dow = ((day_of_week or 0) + 1) % 7
            cron_expr = f"{minute} {hour} * * {cron_dow}"
        elif freq == 'monthly':
            dom = day_of_week if day_of_week and day_of_week >= 1 else 1
            cron_expr = f"{minute} {hour} {dom} * *"
        else:
            cron_expr = f"{minute} {hour} * * *"

        name = self.campaign_cronjob_name(campaign.id)
        manifest = self._build_campaign_cronjob_manifest(name, cron_expr, tz, campaign.id)
        try:
            self.batch_api.create_namespaced_cron_job(namespace=NAMESPACE, body=manifest)
            logger.info("Created recurring campaign CronJob %s schedule=%s tz=%s", name, cron_expr, tz)
        except ApiException as exc:
            if exc.status == 409:
                self.batch_api.replace_namespaced_cron_job(
                    name=name, namespace=NAMESPACE, body=manifest
                )
                logger.info("Updated recurring campaign CronJob %s", name)
            else:
                logger.error("K8s API error creating recurring campaign CronJob %s: %s", name, exc)
                raise

    def remove_campaign_cronjob(self, campaign_id: int):
        """Remove the K8s CronJob for a specific campaign."""
        if self.batch_api is None:
            logger.info("Skipping campaign CronJob removal (not in cluster)")
            return
        name = self.campaign_cronjob_name(campaign_id)
        try:
            self.batch_api.delete_namespaced_cron_job(name=name, namespace=NAMESPACE)
            logger.info("Deleted campaign CronJob %s", name)
        except ApiException as exc:
            if exc.status == 404:
                logger.info("Campaign CronJob %s already removed (404)", name)
            else:
                logger.error("K8s API error deleting campaign CronJob %s: %s", name, exc)
                raise

    def _build_campaign_cronjob_manifest(self, name, cron_expr, timezone_str, campaign_id):
        """Build a V1CronJob manifest for a single campaign execution."""

        def _secret_env(env_name, key, optional=False):
            return client.V1EnvVar(
                name=env_name,
                value_from=client.V1EnvVarSource(
                    secret_key_ref=client.V1SecretKeySelector(
                        name="backend-secrets", key=key, optional=optional,
                    ),
                ),
            )

        env_vars = [
            client.V1EnvVar(name="DEBUG", value="False"),
            client.V1EnvVar(name="EZRA_ENV", value=EZRA_ENV),
            _secret_env("SECRET_KEY", "SECRET_KEY"),
            _secret_env("DATABASE_URL", "DATABASE_URL"),
            _secret_env("INGESTION_API_KEY", "INGESTION_API_KEY"),
            _secret_env("TWILIO_ACCOUNT_SID", "TWILIO_ACCOUNT_SID", optional=True),
            _secret_env("TWILIO_AUTH_TOKEN", "TWILIO_AUTH_TOKEN", optional=True),
            _secret_env("TWILIO_FROM_NUMBER", "TWILIO_FROM_NUMBER", optional=True),
            _secret_env("TWILIO_MESSAGING_SERVICE_SID", "TWILIO_MESSAGING_SERVICE_SID", optional=True),
        ]

        container = client.V1Container(
            name="run-campaign",
            image=self._get_current_image(),
            image_pull_policy="Always",
            command=["python", "manage.py", "run_campaign", "--campaign-id", str(campaign_id)],
            env=env_vars,
            resources=client.V1ResourceRequirements(
                requests={"cpu": "250m", "memory": "512Mi"},
                limits={"cpu": "1000m", "memory": "1Gi"},
            ),
        )

        pod_spec = client.V1PodSpec(containers=[container], restart_policy="OnFailure")
        job_spec = client.V1JobSpec(
            template=client.V1PodTemplateSpec(
                metadata=client.V1ObjectMeta(
                    labels={"app": "backend", "component": "campaign-runner"},
                ),
                spec=pod_spec,
            ),
            backoff_limit=1,
            active_deadline_seconds=300,
        )

        return client.V1CronJob(
            api_version="batch/v1",
            kind="CronJob",
            metadata=client.V1ObjectMeta(
                name=name,
                namespace=NAMESPACE,
                labels={"app": "backend", "component": "campaign-runner", "campaign-id": str(campaign_id)},
            ),
            spec=client.V1CronJobSpec(
                schedule=cron_expr,
                time_zone=timezone_str,
                concurrency_policy="Forbid",
                successful_jobs_history_limit=1,
                failed_jobs_history_limit=1,
                job_template=client.V1JobTemplateSpec(spec=job_spec),
            ),
        )

    # ------------------------------------------------------------------
    # Exponential Campaign Poller CronJob (LEGACY — kept for recurring)
    # ------------------------------------------------------------------

    CAMPAIGN_POLLER_NAME = "exponential-campaign-poller"
    CAMPAIGN_POLLER_SCHEDULE = "*/10 * * * *"

    def _has_scheduled_campaigns(self, exclude_id=None):
        """Check if any campaigns with status='scheduled' exist."""
        from api.models import ExponentialCampaign
        qs = ExponentialCampaign.objects.filter(status='scheduled')
        if exclude_id:
            qs = qs.exclude(id=exclude_id)
        return qs.exists()

    def _build_campaign_poller_manifest(self):
        """Build the V1CronJob manifest for the campaign poller."""

        def _secret_env(env_name, key, optional=False):
            return client.V1EnvVar(
                name=env_name,
                value_from=client.V1EnvVarSource(
                    secret_key_ref=client.V1SecretKeySelector(
                        name="backend-secrets",
                        key=key,
                        optional=optional,
                    ),
                ),
            )

        env_vars = [
            client.V1EnvVar(name="DEBUG", value="False"),
            client.V1EnvVar(name="EZRA_ENV", value=EZRA_ENV),
            _secret_env("SECRET_KEY", "SECRET_KEY"),
            _secret_env("DATABASE_URL", "DATABASE_URL"),
            _secret_env("INGESTION_API_KEY", "INGESTION_API_KEY"),
            _secret_env("TWILIO_ACCOUNT_SID", "TWILIO_ACCOUNT_SID", optional=True),
            _secret_env("TWILIO_AUTH_TOKEN", "TWILIO_AUTH_TOKEN", optional=True),
            _secret_env("TWILIO_FROM_NUMBER", "TWILIO_FROM_NUMBER", optional=True),
            _secret_env("TWILIO_MESSAGING_SERVICE_SID", "TWILIO_MESSAGING_SERVICE_SID", optional=True),
        ]

        container = client.V1Container(
            name="run-campaigns",
            image=self._get_current_image(),
            image_pull_policy="Always",
            command=["python", "manage.py", "run_scheduled_campaigns"],
            env=env_vars,
            resources=client.V1ResourceRequirements(
                requests={"cpu": "250m", "memory": "512Mi"},
                limits={"cpu": "1000m", "memory": "1Gi"},
            ),
        )

        pod_spec = client.V1PodSpec(
            containers=[container],
            restart_policy="OnFailure",
        )

        job_spec = client.V1JobSpec(
            template=client.V1PodTemplateSpec(
                metadata=client.V1ObjectMeta(
                    labels={"app": "backend", "component": "exponential-scheduler"},
                ),
                spec=pod_spec,
            ),
            backoff_limit=1,
            active_deadline_seconds=300,
        )

        return client.V1CronJob(
            api_version="batch/v1",
            kind="CronJob",
            metadata=client.V1ObjectMeta(
                name=self.CAMPAIGN_POLLER_NAME,
                namespace=NAMESPACE,
                labels={"app": "backend", "component": "exponential-scheduler"},
            ),
            spec=client.V1CronJobSpec(
                schedule=self.CAMPAIGN_POLLER_SCHEDULE,
                concurrency_policy="Forbid",
                successful_jobs_history_limit=5,
                failed_jobs_history_limit=3,
                job_template=client.V1JobTemplateSpec(spec=job_spec),
            ),
        )

    def ensure_campaign_poller(self):
        """Create or update the campaign poller CronJob if scheduled campaigns exist."""
        if self.batch_api is None:
            logger.info("Skipping campaign poller ensure (not in cluster)")
            return

        if not self._has_scheduled_campaigns():
            logger.info("No scheduled campaigns — skipping poller creation")
            return

        manifest = self._build_campaign_poller_manifest()
        try:
            self.batch_api.create_namespaced_cron_job(
                namespace=NAMESPACE, body=manifest
            )
            logger.info("Created campaign poller CronJob %s", self.CAMPAIGN_POLLER_NAME)
        except ApiException as exc:
            if exc.status == 409:
                self.batch_api.replace_namespaced_cron_job(
                    name=self.CAMPAIGN_POLLER_NAME, namespace=NAMESPACE, body=manifest
                )
                logger.info("Updated campaign poller CronJob %s", self.CAMPAIGN_POLLER_NAME)
            else:
                logger.error("K8s API error creating campaign poller: %s", exc)
                raise

    def maybe_remove_campaign_poller(self, exclude_id=None):
        """Remove the campaign poller CronJob if no scheduled campaigns remain."""
        if self.batch_api is None:
            logger.info("Skipping campaign poller removal (not in cluster)")
            return

        if self._has_scheduled_campaigns(exclude_id=exclude_id):
            logger.info("Scheduled campaigns still exist — keeping poller")
            return

        try:
            self.batch_api.delete_namespaced_cron_job(
                name=self.CAMPAIGN_POLLER_NAME, namespace=NAMESPACE
            )
            logger.info("Deleted campaign poller CronJob %s", self.CAMPAIGN_POLLER_NAME)
        except ApiException as exc:
            if exc.status == 404:
                logger.info("Campaign poller already removed (404)")
            else:
                logger.error("K8s API error deleting campaign poller: %s", exc)
                raise
