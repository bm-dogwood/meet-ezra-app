"""Unit tests for api.services.cronjob_manager module."""

import hashlib
from unittest.mock import MagicMock, patch

from django.test import SimpleTestCase

from kubernetes.client.exceptions import ApiException

from api.services.cronjob_manager import CONTAINER_IMAGE, NAMESPACE, CronJobManager


# ---------------------------------------------------------------------------
# Tests that don't need the database (SimpleTestCase)
# ---------------------------------------------------------------------------


class CronKeyToNameTests(SimpleTestCase):
    """Tests for CronJobManager.cron_key_to_name."""

    def test_deterministic(self):
        """Same cron_key always produces the same name."""
        name1 = CronJobManager.cron_key_to_name("0 8 * * *|America/Chicago")
        name2 = CronJobManager.cron_key_to_name("0 8 * * *|America/Chicago")
        self.assertEqual(name1, name2)

    def test_prefix(self):
        name = CronJobManager.cron_key_to_name("0 8 * * *|UTC")
        self.assertTrue(name.startswith("report-schedule-"))

    def test_dns_safe(self):
        """Name must be lowercase alphanumeric + hyphens (DNS-1123 label)."""
        name = CronJobManager.cron_key_to_name("*/15 0-23/2 * * 1,3,5|Asia/Tokyo")
        import re
        self.assertRegex(name, r"^[a-z0-9][a-z0-9\-]*[a-z0-9]$")

    def test_hash_matches_sha256(self):
        cron_key = "0 8 * * *|America/Chicago"
        expected_hash = hashlib.sha256(cron_key.encode()).hexdigest()[:12]
        expected_name = f"report-schedule-{expected_hash}"
        self.assertEqual(CronJobManager.cron_key_to_name(cron_key), expected_name)

    def test_different_keys_different_names(self):
        name_a = CronJobManager.cron_key_to_name("0 8 * * *|UTC")
        name_b = CronJobManager.cron_key_to_name("0 9 * * *|UTC")
        self.assertNotEqual(name_a, name_b)


# ---------------------------------------------------------------------------
# Tests that mock the K8s client
# ---------------------------------------------------------------------------


def _make_manager():
    """Create a CronJobManager with mocked in-cluster config."""
    with patch("api.services.cronjob_manager.config.load_incluster_config"):
        mgr = CronJobManager()
    mgr.batch_api = MagicMock()
    return mgr


class BuildCronJobManifestTests(SimpleTestCase):
    """Tests for the generated CronJob manifest."""

    def setUp(self):
        self.mgr = _make_manager()

    def test_manifest_namespace(self):
        manifest = self.mgr._build_cronjob_manifest(
            "test-cj", "0 8 * * *", "America/Chicago", "0 14 * * *"
        )
        self.assertEqual(manifest.metadata.namespace, NAMESPACE)

    def test_manifest_image(self):
        manifest = self.mgr._build_cronjob_manifest(
            "test-cj", "0 8 * * *", "UTC", "0 8 * * *"
        )
        container = manifest.spec.job_template.spec.template.spec.containers[0]
        self.assertEqual(container.image, CONTAINER_IMAGE)

    def test_manifest_command_args(self):
        manifest = self.mgr._build_cronjob_manifest(
            "test-cj", "30 9 * * 1-5", "Asia/Tokyo", "30 0 * * 1-5"
        )
        container = manifest.spec.job_template.spec.template.spec.containers[0]
        cmd = container.command
        self.assertIn("--cron-expression", cmd)
        self.assertIn("30 9 * * 1-5", cmd)
        self.assertIn("--timezone", cmd)
        self.assertIn("Asia/Tokyo", cmd)

    def test_manifest_timezone_field(self):
        manifest = self.mgr._build_cronjob_manifest(
            "test-cj", "0 8 * * *", "America/New_York", "0 13 * * *"
        )
        self.assertEqual(manifest.spec.time_zone, "America/New_York")

    def test_manifest_schedule_is_utc_cron(self):
        manifest = self.mgr._build_cronjob_manifest(
            "test-cj", "0 8 * * *", "America/Chicago", "0 14 * * *"
        )
        self.assertEqual(manifest.spec.schedule, "0 14 * * *")

    def test_manifest_labels(self):
        manifest = self.mgr._build_cronjob_manifest(
            "test-cj", "0 8 * * *", "UTC", "0 8 * * *"
        )
        self.assertEqual(manifest.metadata.labels["app"], "backend")
        self.assertEqual(manifest.metadata.labels["component"], "report-scheduler")

    def test_manifest_resource_limits(self):
        manifest = self.mgr._build_cronjob_manifest(
            "test-cj", "0 8 * * *", "UTC", "0 8 * * *"
        )
        container = manifest.spec.job_template.spec.template.spec.containers[0]
        self.assertEqual(container.resources.requests["cpu"], "250m")
        self.assertEqual(container.resources.requests["memory"], "512Mi")
        self.assertEqual(container.resources.limits["cpu"], "1000m")
        self.assertEqual(container.resources.limits["memory"], "1Gi")

    def test_manifest_concurrency_policy(self):
        manifest = self.mgr._build_cronjob_manifest(
            "test-cj", "0 8 * * *", "UTC", "0 8 * * *"
        )
        self.assertEqual(manifest.spec.concurrency_policy, "Forbid")

    def test_manifest_env_vars_present(self):
        manifest = self.mgr._build_cronjob_manifest(
            "test-cj", "0 8 * * *", "UTC", "0 8 * * *"
        )
        container = manifest.spec.job_template.spec.template.spec.containers[0]
        env_names = [e.name for e in container.env]
        for expected in [
            "DEBUG", "EMAIL_HOST", "EMAIL_PORT", "ADMIN_URL", "FRONTEND_URL",
            "SECRET_KEY", "DATABASE_URL", "INGESTION_API_KEY",
            "EMAIL_HOST_USER", "EMAIL_HOST_PASSWORD", "DEFAULT_FROM_EMAIL",
        ]:
            self.assertIn(expected, env_names)

    def test_manifest_secret_refs(self):
        manifest = self.mgr._build_cronjob_manifest(
            "test-cj", "0 8 * * *", "UTC", "0 8 * * *"
        )
        container = manifest.spec.job_template.spec.template.spec.containers[0]
        secret_envs = [e for e in container.env if e.value_from is not None]
        for env in secret_envs:
            self.assertEqual(
                env.value_from.secret_key_ref.name, "backend-secrets"
            )

    def test_manifest_restart_policy(self):
        manifest = self.mgr._build_cronjob_manifest(
            "test-cj", "0 8 * * *", "UTC", "0 8 * * *"
        )
        self.assertEqual(
            manifest.spec.job_template.spec.template.spec.restart_policy,
            "OnFailure",
        )

    def test_manifest_backoff_limit(self):
        manifest = self.mgr._build_cronjob_manifest(
            "test-cj", "0 8 * * *", "UTC", "0 8 * * *"
        )
        self.assertEqual(manifest.spec.job_template.spec.backoff_limit, 2)

    def test_manifest_active_deadline(self):
        manifest = self.mgr._build_cronjob_manifest(
            "test-cj", "0 8 * * *", "UTC", "0 8 * * *"
        )
        self.assertEqual(
            manifest.spec.job_template.spec.active_deadline_seconds, 600
        )


class EnsureCronjobTests(SimpleTestCase):
    """Tests for CronJobManager.ensure_cronjob."""

    def setUp(self):
        self.mgr = _make_manager()

    def test_create_success(self):
        self.mgr.batch_api.create_namespaced_cron_job.return_value = None
        self.mgr.ensure_cronjob("0 8 * * *", "UTC", "0 8 * * *")
        self.mgr.batch_api.create_namespaced_cron_job.assert_called_once()

    def test_409_conflict_triggers_replace(self):
        exc = ApiException(status=409, reason="Conflict")
        self.mgr.batch_api.create_namespaced_cron_job.side_effect = exc
        self.mgr.batch_api.replace_namespaced_cron_job.return_value = None

        self.mgr.ensure_cronjob("0 8 * * *", "UTC", "0 8 * * *")

        self.mgr.batch_api.replace_namespaced_cron_job.assert_called_once()

    def test_other_api_error_raises(self):
        exc = ApiException(status=500, reason="Internal Server Error")
        self.mgr.batch_api.create_namespaced_cron_job.side_effect = exc

        with self.assertRaises(ApiException):
            self.mgr.ensure_cronjob("0 8 * * *", "UTC", "0 8 * * *")

    def test_403_forbidden_raises(self):
        exc = ApiException(status=403, reason="Forbidden")
        self.mgr.batch_api.create_namespaced_cron_job.side_effect = exc

        with self.assertRaises(ApiException):
            self.mgr.ensure_cronjob("0 8 * * *", "UTC", "0 8 * * *")

    def test_create_uses_correct_namespace(self):
        self.mgr.batch_api.create_namespaced_cron_job.return_value = None
        self.mgr.ensure_cronjob("0 8 * * *", "UTC", "0 8 * * *")
        call_kwargs = self.mgr.batch_api.create_namespaced_cron_job.call_args
        self.assertEqual(call_kwargs.kwargs["namespace"], NAMESPACE)


class MaybeRemoveCronjobTests(SimpleTestCase):
    """Tests for CronJobManager.maybe_remove_cronjob."""

    def setUp(self):
        self.mgr = _make_manager()

    @patch.object(CronJobManager, "_has_other_active_schedules", return_value=False)
    def test_removes_when_no_other_schedules(self, mock_has):
        self.mgr.batch_api.delete_namespaced_cron_job.return_value = None
        self.mgr.maybe_remove_cronjob("0 8 * * *", "UTC")
        self.mgr.batch_api.delete_namespaced_cron_job.assert_called_once()

    @patch.object(CronJobManager, "_has_other_active_schedules", return_value=True)
    def test_skips_when_other_schedules_exist(self, mock_has):
        self.mgr.maybe_remove_cronjob("0 8 * * *", "UTC")
        self.mgr.batch_api.delete_namespaced_cron_job.assert_not_called()

    @patch.object(CronJobManager, "_has_other_active_schedules", return_value=False)
    def test_404_treated_as_success(self, mock_has):
        exc = ApiException(status=404, reason="Not Found")
        self.mgr.batch_api.delete_namespaced_cron_job.side_effect = exc
        # Should not raise
        self.mgr.maybe_remove_cronjob("0 8 * * *", "UTC")

    @patch.object(CronJobManager, "_has_other_active_schedules", return_value=False)
    def test_other_api_error_raises(self, mock_has):
        exc = ApiException(status=500, reason="Internal Server Error")
        self.mgr.batch_api.delete_namespaced_cron_job.side_effect = exc

        with self.assertRaises(ApiException):
            self.mgr.maybe_remove_cronjob("0 8 * * *", "UTC")


class SuspendCronjobTests(SimpleTestCase):
    """Tests for CronJobManager.suspend_cronjob."""

    def setUp(self):
        self.mgr = _make_manager()

    @patch.object(CronJobManager, "_has_other_active_schedules", return_value=False)
    def test_suspends_when_no_other_schedules(self, mock_has):
        self.mgr.batch_api.patch_namespaced_cron_job.return_value = None
        self.mgr.suspend_cronjob("0 8 * * *", "UTC")
        call_kwargs = self.mgr.batch_api.patch_namespaced_cron_job.call_args
        self.assertEqual(call_kwargs.kwargs["body"], {"spec": {"suspend": True}})

    @patch.object(CronJobManager, "_has_other_active_schedules", return_value=True)
    def test_skips_when_other_schedules_exist(self, mock_has):
        self.mgr.suspend_cronjob("0 8 * * *", "UTC")
        self.mgr.batch_api.patch_namespaced_cron_job.assert_not_called()

    @patch.object(CronJobManager, "_has_other_active_schedules", return_value=False)
    def test_api_error_raises(self, mock_has):
        exc = ApiException(status=500, reason="Internal Server Error")
        self.mgr.batch_api.patch_namespaced_cron_job.side_effect = exc

        with self.assertRaises(ApiException):
            self.mgr.suspend_cronjob("0 8 * * *", "UTC")


class UnsuspendCronjobTests(SimpleTestCase):
    """Tests for CronJobManager.unsuspend_cronjob."""

    def setUp(self):
        self.mgr = _make_manager()

    def test_unsuspends(self):
        self.mgr.batch_api.patch_namespaced_cron_job.return_value = None
        self.mgr.unsuspend_cronjob("0 8 * * *", "UTC")
        call_kwargs = self.mgr.batch_api.patch_namespaced_cron_job.call_args
        self.assertEqual(call_kwargs.kwargs["body"], {"spec": {"suspend": False}})

    def test_uses_correct_name(self):
        self.mgr.batch_api.patch_namespaced_cron_job.return_value = None
        self.mgr.unsuspend_cronjob("0 8 * * *", "UTC")
        cron_key = "0 8 * * *|UTC"
        expected_name = CronJobManager.cron_key_to_name(cron_key)
        call_kwargs = self.mgr.batch_api.patch_namespaced_cron_job.call_args
        self.assertEqual(call_kwargs.kwargs["name"], expected_name)

    def test_api_error_raises(self):
        exc = ApiException(status=500, reason="Internal Server Error")
        self.mgr.batch_api.patch_namespaced_cron_job.side_effect = exc

        with self.assertRaises(ApiException):
            self.mgr.unsuspend_cronjob("0 8 * * *", "UTC")
