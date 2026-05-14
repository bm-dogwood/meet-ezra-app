"""Unit tests for ReportScheduleViewSet CronJob lifecycle hooks.

These tests verify that perform_create, perform_update, and perform_destroy
correctly call CronJobManager methods and handle K8s API errors.
"""

import sys
from types import SimpleNamespace
from unittest.mock import patch, MagicMock

from django.test import SimpleTestCase

from api.views import ReportScheduleViewSet, CronJobProvisioningError

_UTC_PATH = "api.views.local_cron_to_utc"


def _make_schedule(
    pk=1,
    cron_expression="0 8 * * *",
    timezone="America/Chicago",
    is_active=True,
):
    """Create a lightweight schedule-like object for testing."""
    s = SimpleNamespace(
        pk=pk,
        cron_expression=cron_expression,
        timezone=timezone,
        is_active=is_active,
    )
    s.cron_key = f"{cron_expression}|{timezone}"
    s.delete = MagicMock()
    return s


def _make_serializer(schedule, validated_data=None):
    """Create a mock serializer that returns the given schedule on save."""
    ser = MagicMock()
    ser.save.return_value = schedule
    ser.validated_data = validated_data or {}
    return ser


def _patch_cronjob_manager():
    """Patch the CronJobManager import inside perform_* methods.

    The ``kubernetes`` package is not installed in the test venv, so
    ``api.services.cronjob_manager`` cannot be imported directly.
    We inject a mock module into ``sys.modules`` so the lazy
    ``from api.services.cronjob_manager import CronJobManager``
    inside each ViewSet method resolves to our mock.
    """
    mock_cjm_cls = MagicMock()
    mock_module = MagicMock()
    mock_module.CronJobManager = mock_cjm_cls

    patcher = patch.dict(sys.modules, {
        "kubernetes": MagicMock(),
        "kubernetes.client": MagicMock(),
        "kubernetes.client.exceptions": MagicMock(),
        "api.services.cronjob_manager": mock_module,
    })
    return patcher, mock_cjm_cls


class PerformCreateTests(SimpleTestCase):
    """Tests for perform_create — CronJob provisioning on schedule creation."""

    def _get_viewset(self):
        vs = ReportScheduleViewSet()
        vs.request = MagicMock()
        vs.request.user = SimpleNamespace(
            pk=1, role="franchisor_admin", tenant=SimpleNamespace(pk=10)
        )
        return vs

    @patch(_UTC_PATH, return_value="0 14 * * *")
    def test_calls_ensure_cronjob(self, mock_utc):
        patcher, mock_cjm_cls = _patch_cronjob_manager()
        mock_manager = MagicMock()
        mock_cjm_cls.return_value = mock_manager

        schedule = _make_schedule()
        serializer = _make_serializer(schedule)
        vs = self._get_viewset()

        with patcher:
            vs.perform_create(serializer)

        mock_utc.assert_called_once_with("0 8 * * *", "America/Chicago")
        mock_manager.ensure_cronjob.assert_called_once_with(
            "0 8 * * *", "America/Chicago", "0 14 * * *"
        )

    @patch(_UTC_PATH, return_value="0 14 * * *")
    def test_saves_schedule_before_cronjob(self, mock_utc):
        patcher, mock_cjm_cls = _patch_cronjob_manager()
        mock_cjm_cls.return_value = MagicMock()

        schedule = _make_schedule()
        serializer = _make_serializer(schedule)
        vs = self._get_viewset()

        with patcher:
            vs.perform_create(serializer)

        serializer.save.assert_called_once()

    @patch(_UTC_PATH, return_value="0 14 * * *")
    def test_raises_500_on_k8s_error(self, mock_utc):
        patcher, mock_cjm_cls = _patch_cronjob_manager()
        mock_manager = MagicMock()
        mock_manager.ensure_cronjob.side_effect = RuntimeError("K8s unreachable")
        mock_cjm_cls.return_value = mock_manager

        schedule = _make_schedule()
        serializer = _make_serializer(schedule)
        vs = self._get_viewset()

        with patcher:
            with self.assertRaises(CronJobProvisioningError) as ctx:
                vs.perform_create(serializer)

        self.assertEqual(ctx.exception.status_code, 500)
        self.assertIn("CronJob", str(ctx.exception.detail))
        # Schedule save was still called
        serializer.save.assert_called_once()


class PerformUpdateTests(SimpleTestCase):
    """Tests for perform_update — CronJob lifecycle on schedule update."""

    def _get_viewset(self, old_schedule):
        vs = ReportScheduleViewSet()
        vs.request = MagicMock()
        vs.kwargs = {}
        vs.get_object = MagicMock(return_value=old_schedule)
        return vs

    @patch(_UTC_PATH, return_value="0 15 * * *")
    def test_calls_ensure_cronjob(self, mock_utc):
        patcher, mock_cjm_cls = _patch_cronjob_manager()
        mock_manager = MagicMock()
        mock_cjm_cls.return_value = mock_manager

        old = _make_schedule(cron_expression="0 8 * * *", timezone="America/Chicago")
        new = _make_schedule(cron_expression="0 9 * * *", timezone="America/Chicago")
        serializer = _make_serializer(new)
        vs = self._get_viewset(old)

        with patcher:
            vs.perform_update(serializer)

        mock_manager.ensure_cronjob.assert_called_once_with(
            "0 9 * * *", "America/Chicago", "0 15 * * *"
        )

    @patch(_UTC_PATH, return_value="0 15 * * *")
    def test_removes_old_cronjob_on_cron_key_change(self, mock_utc):
        patcher, mock_cjm_cls = _patch_cronjob_manager()
        mock_manager = MagicMock()
        mock_cjm_cls.return_value = mock_manager

        old = _make_schedule(cron_expression="0 8 * * *", timezone="America/Chicago")
        new = _make_schedule(cron_expression="0 9 * * *", timezone="America/New_York")
        serializer = _make_serializer(new)
        vs = self._get_viewset(old)

        with patcher:
            vs.perform_update(serializer)

        mock_manager.maybe_remove_cronjob.assert_called_once_with(
            "0 8 * * *", "America/Chicago"
        )

    @patch(_UTC_PATH, return_value="0 14 * * *")
    def test_does_not_remove_old_when_cron_key_unchanged(self, mock_utc):
        patcher, mock_cjm_cls = _patch_cronjob_manager()
        mock_manager = MagicMock()
        mock_cjm_cls.return_value = mock_manager

        old = _make_schedule(cron_expression="0 8 * * *", timezone="America/Chicago")
        new = _make_schedule(cron_expression="0 8 * * *", timezone="America/Chicago")
        serializer = _make_serializer(new)
        vs = self._get_viewset(old)

        with patcher:
            vs.perform_update(serializer)

        mock_manager.maybe_remove_cronjob.assert_not_called()

    @patch(_UTC_PATH, return_value="0 14 * * *")
    def test_unsuspends_on_reactivation(self, mock_utc):
        patcher, mock_cjm_cls = _patch_cronjob_manager()
        mock_manager = MagicMock()
        mock_cjm_cls.return_value = mock_manager

        old = _make_schedule(is_active=False)
        new = _make_schedule(is_active=True)
        serializer = _make_serializer(new, validated_data={"is_active": True})
        vs = self._get_viewset(old)

        with patcher:
            vs.perform_update(serializer)

        mock_manager.unsuspend_cronjob.assert_called_once_with(
            "0 8 * * *", "America/Chicago"
        )
        mock_manager.suspend_cronjob.assert_not_called()

    @patch(_UTC_PATH, return_value="0 14 * * *")
    def test_suspends_on_deactivation(self, mock_utc):
        patcher, mock_cjm_cls = _patch_cronjob_manager()
        mock_manager = MagicMock()
        mock_cjm_cls.return_value = mock_manager

        old = _make_schedule(is_active=True)
        new = _make_schedule(is_active=False)
        serializer = _make_serializer(new, validated_data={"is_active": False})
        vs = self._get_viewset(old)

        with patcher:
            vs.perform_update(serializer)

        mock_manager.suspend_cronjob.assert_called_once_with(
            "0 8 * * *", "America/Chicago"
        )
        mock_manager.unsuspend_cronjob.assert_not_called()

    @patch(_UTC_PATH, return_value="0 14 * * *")
    def test_no_suspend_unsuspend_when_is_active_not_in_payload(self, mock_utc):
        patcher, mock_cjm_cls = _patch_cronjob_manager()
        mock_manager = MagicMock()
        mock_cjm_cls.return_value = mock_manager

        old = _make_schedule(is_active=True)
        new = _make_schedule(is_active=True)
        serializer = _make_serializer(new, validated_data={"report_types": ["daily", "lp"]})
        vs = self._get_viewset(old)

        with patcher:
            vs.perform_update(serializer)

        mock_manager.suspend_cronjob.assert_not_called()
        mock_manager.unsuspend_cronjob.assert_not_called()

    @patch(_UTC_PATH, return_value="0 14 * * *")
    def test_raises_500_on_k8s_error(self, mock_utc):
        patcher, mock_cjm_cls = _patch_cronjob_manager()
        mock_manager = MagicMock()
        mock_manager.ensure_cronjob.side_effect = RuntimeError("K8s timeout")
        mock_cjm_cls.return_value = mock_manager

        old = _make_schedule()
        new = _make_schedule()
        serializer = _make_serializer(new)
        vs = self._get_viewset(old)

        with patcher:
            with self.assertRaises(CronJobProvisioningError) as ctx:
                vs.perform_update(serializer)

        self.assertEqual(ctx.exception.status_code, 500)


class PerformDestroyTests(SimpleTestCase):
    """Tests for perform_destroy — CronJob removal on schedule deletion."""

    def _get_viewset(self):
        vs = ReportScheduleViewSet()
        vs.request = MagicMock()
        return vs

    def test_calls_maybe_remove_cronjob(self):
        patcher, mock_cjm_cls = _patch_cronjob_manager()
        mock_manager = MagicMock()
        mock_cjm_cls.return_value = mock_manager

        instance = _make_schedule()
        vs = self._get_viewset()

        with patcher:
            vs.perform_destroy(instance)

        instance.delete.assert_called_once()
        mock_manager.maybe_remove_cronjob.assert_called_once_with(
            "0 8 * * *", "America/Chicago"
        )

    def test_raises_500_on_k8s_error(self):
        patcher, mock_cjm_cls = _patch_cronjob_manager()
        mock_manager = MagicMock()
        mock_manager.maybe_remove_cronjob.side_effect = RuntimeError("K8s error")
        mock_cjm_cls.return_value = mock_manager

        instance = _make_schedule()
        vs = self._get_viewset()

        with patcher:
            with self.assertRaises(CronJobProvisioningError) as ctx:
                vs.perform_destroy(instance)

        self.assertEqual(ctx.exception.status_code, 500)
        # Instance should still be deleted (deleted before CronJob call)
        instance.delete.assert_called_once()

    def test_passes_correct_cron_key_parts(self):
        patcher, mock_cjm_cls = _patch_cronjob_manager()
        mock_manager = MagicMock()
        mock_cjm_cls.return_value = mock_manager

        instance = _make_schedule(
            cron_expression="30 14 * * 1-5",
            timezone="US/Eastern",
        )
        vs = self._get_viewset()

        with patcher:
            vs.perform_destroy(instance)

        mock_manager.maybe_remove_cronjob.assert_called_once_with(
            "30 14 * * 1-5", "US/Eastern"
        )


class CronJobProvisioningErrorTests(SimpleTestCase):
    """Tests for the CronJobProvisioningError exception."""

    def test_status_code_is_500(self):
        err = CronJobProvisioningError()
        self.assertEqual(err.status_code, 500)

    def test_detail_mentions_cronjob(self):
        err = CronJobProvisioningError()
        self.assertIn("CronJob", str(err.detail))

    def test_default_code(self):
        err = CronJobProvisioningError()
        self.assertEqual(err.default_code, "cronjob_provisioning_error")
