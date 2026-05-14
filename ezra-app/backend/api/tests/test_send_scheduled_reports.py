"""Unit tests for the send_scheduled_reports management command."""

from datetime import date, time, timedelta
from io import BytesIO
from unittest.mock import patch, MagicMock, call

from django.test import SimpleTestCase

from api.management.commands.send_scheduled_reports import Command


class SendScheduledReportsArgumentTests(SimpleTestCase):
    """Tests for argument parsing and basic flow."""

    def _make_command(self, stdout=None, stderr=None):
        cmd = Command()
        if stdout:
            cmd.stdout = stdout
        if stderr:
            cmd.stderr = stderr
        return cmd

    def test_invalid_time_format_prints_error(self):
        """Command should print an error for malformed --time values."""
        stderr = MagicMock()
        cmd = self._make_command(stderr=stderr)
        cmd.handle(time='bad', timezone='UTC', cron_expression=None)
        stderr.write.assert_called()
        error_msg = str(stderr.write.call_args)
        self.assertIn('Invalid time format', error_msg)

    def test_invalid_time_format_colon_but_bad_numbers(self):
        """Command should handle time like '25:99' gracefully."""
        stderr = MagicMock()
        cmd = self._make_command(stderr=stderr)
        cmd.handle(time='25:99', timezone='UTC', cron_expression=None)
        stderr.write.assert_called()

    def test_no_time_and_no_cron_expression_prints_error(self):
        """Command should error when neither --time nor --cron-expression is provided."""
        stderr = MagicMock()
        cmd = self._make_command(stderr=stderr)
        cmd.handle(time=None, timezone='UTC', cron_expression=None)
        stderr.write.assert_called()
        error_msg = str(stderr.write.call_args)
        self.assertIn('--cron-expression or --time', error_msg)

    @patch('api.management.commands.send_scheduled_reports.ReportSchedule')
    def test_no_matching_schedules_prints_message(self, mock_model):
        """Command should report when no schedules match."""
        mock_qs = MagicMock()
        mock_qs.count.return_value = 0
        mock_model.objects.filter.return_value = mock_qs

        stdout = MagicMock()
        cmd = self._make_command(stdout=stdout)
        cmd.handle(time='08:00', timezone='UTC', cron_expression=None)

        calls = [str(c) for c in stdout.write.call_args_list]
        self.assertTrue(any('No matching' in c for c in calls))


class SendScheduledReportsQueryTests(SimpleTestCase):
    """Tests for schedule querying logic."""

    def _make_command(self):
        cmd = Command()
        cmd.stdout = MagicMock()
        cmd.stderr = MagicMock()
        return cmd

    @patch('api.management.commands.send_scheduled_reports.ReportSchedule')
    def test_queries_active_schedules_with_correct_time_and_tz(self, mock_model):
        """Legacy path: filter should use is_active=True, matching time and timezone."""
        mock_qs = MagicMock()
        mock_qs.count.return_value = 0
        mock_model.objects.filter.return_value = mock_qs

        cmd = self._make_command()
        cmd.handle(time='08:00', timezone='America/Chicago', cron_expression=None)

        mock_model.objects.filter.assert_called_once_with(
            is_active=True,
            schedule_time=time(8, 0),
            timezone='America/Chicago',
        )

    @patch('api.management.commands.send_scheduled_reports.ReportSchedule')
    def test_queries_with_minutes(self, mock_model):
        """Legacy path: filter should correctly parse times with non-zero minutes."""
        mock_qs = MagicMock()
        mock_qs.count.return_value = 0
        mock_model.objects.filter.return_value = mock_qs

        cmd = self._make_command()
        cmd.handle(time='14:30', timezone='UTC', cron_expression=None)

        mock_model.objects.filter.assert_called_once_with(
            is_active=True,
            schedule_time=time(14, 30),
            timezone='UTC',
        )

    @patch('api.management.commands.send_scheduled_reports.ReportSchedule')
    def test_cron_expression_queries_by_cron_and_tz(self, mock_model):
        """New path: --cron-expression should filter by cron_expression + timezone."""
        mock_qs = MagicMock()
        mock_qs.count.return_value = 0
        mock_model.objects.filter.return_value = mock_qs

        cmd = self._make_command()
        cmd.handle(time=None, timezone='America/Chicago', cron_expression='0 8 * * 1-5')

        mock_model.objects.filter.assert_called_once_with(
            is_active=True,
            cron_expression='0 8 * * 1-5',
            timezone='America/Chicago',
        )

    @patch('api.management.commands.send_scheduled_reports.ReportSchedule')
    def test_cron_expression_takes_precedence_over_time(self, mock_model):
        """When both --cron-expression and --time are provided, cron takes precedence."""
        mock_qs = MagicMock()
        mock_qs.count.return_value = 0
        mock_model.objects.filter.return_value = mock_qs

        cmd = self._make_command()
        cmd.handle(time='08:00', timezone='UTC', cron_expression='0 8 * * *')

        mock_model.objects.filter.assert_called_once_with(
            is_active=True,
            cron_expression='0 8 * * *',
            timezone='UTC',
        )


class SendScheduledReportsExecutionTests(SimpleTestCase):
    """Tests for schedule execution, email, and metadata updates."""

    def _make_command(self):
        cmd = Command()
        cmd.stdout = MagicMock()
        cmd.stderr = MagicMock()
        return cmd

    def _make_schedule(self, report_types=None, recipients=None, tenant_name='Test'):
        """Create a mock ReportSchedule with report_types (list)."""
        schedule = MagicMock()
        schedule.id = 1
        schedule.report_types = report_types or ['daily']
        schedule.recipients = recipients or ['user@example.com']
        schedule.tenant = MagicMock()
        schedule.tenant.name = tenant_name
        schedule.last_run_at = None
        schedule.last_run_status = None
        schedule.last_run_error = None
        return schedule

    @patch('api.management.commands.send_scheduled_reports.send_scheduled_reports_multi')
    @patch('api.management.commands.send_scheduled_reports.ReportSchedule')
    def test_single_report_type_sends_email(self, mock_model, mock_send_multi):
        """Schedule with one report type should generate and send it."""
        schedule = self._make_schedule(
            report_types=['daily'],
            recipients=['a@test.com', 'b@test.com'],
        )

        mock_qs = MagicMock()
        mock_qs.count.return_value = 1
        mock_qs.__iter__ = MagicMock(return_value=iter([schedule]))
        mock_model.objects.filter.return_value = mock_qs

        cmd = self._make_command()
        with patch.object(cmd, '_generate_report') as mock_gen:
            fake_bytes = BytesIO(b'fake-excel')
            mock_gen.return_value = (fake_bytes, 'daily_sales_flash_2024-01-15.xlsx', 'Daily Sales Flash')
            cmd.handle(time='08:00', timezone='UTC', cron_expression=None)

        mock_send_multi.assert_called_once_with(
            recipients=['a@test.com', 'b@test.com'],
            attachments=[('daily_sales_flash_2024-01-15.xlsx', fake_bytes, 'Daily Sales Flash')],
        )

    @patch('api.management.commands.send_scheduled_reports.send_scheduled_reports_multi')
    @patch('api.management.commands.send_scheduled_reports.ReportSchedule')
    def test_multiple_report_types_sends_all_attachments(self, mock_model, mock_send_multi):
        """Schedule with multiple report types should send all as attachments."""
        schedule = self._make_schedule(
            report_types=['daily', 'lp'],
            recipients=['user@test.com'],
        )

        mock_qs = MagicMock()
        mock_qs.count.return_value = 1
        mock_qs.__iter__ = MagicMock(return_value=iter([schedule]))
        mock_model.objects.filter.return_value = mock_qs

        cmd = self._make_command()
        daily_bytes = BytesIO(b'daily-excel')
        lp_bytes = BytesIO(b'lp-excel')

        def gen_side_effect(report_type, tenant):
            if report_type == 'daily':
                return (daily_bytes, 'daily.xlsx', 'Daily Sales Flash')
            elif report_type == 'lp':
                return (lp_bytes, 'lp.xlsx', 'LP Risk Analysis')

        with patch.object(cmd, '_generate_report', side_effect=gen_side_effect):
            cmd.handle(time='08:00', timezone='UTC', cron_expression=None)

        mock_send_multi.assert_called_once()
        call_kwargs = mock_send_multi.call_args[1]
        self.assertEqual(len(call_kwargs['attachments']), 2)
        self.assertEqual(call_kwargs['attachments'][0][0], 'daily.xlsx')
        self.assertEqual(call_kwargs['attachments'][1][0], 'lp.xlsx')

    @patch('api.management.commands.send_scheduled_reports.send_scheduled_reports_multi')
    @patch('api.management.commands.send_scheduled_reports.ReportSchedule')
    def test_cron_expression_path_executes_schedules(self, mock_model, mock_send_multi):
        """--cron-expression path should find and execute matching schedules."""
        schedule = self._make_schedule(report_types=['weekly'])

        mock_qs = MagicMock()
        mock_qs.count.return_value = 1
        mock_qs.__iter__ = MagicMock(return_value=iter([schedule]))
        mock_model.objects.filter.return_value = mock_qs

        cmd = self._make_command()
        with patch.object(cmd, '_generate_report') as mock_gen:
            mock_gen.return_value = (BytesIO(b'x'), 'weekly.xlsx', 'Weekly Sales Summary')
            cmd.handle(time=None, timezone='America/Chicago', cron_expression='0 10 * * 1')

        mock_model.objects.filter.assert_called_once_with(
            is_active=True,
            cron_expression='0 10 * * 1',
            timezone='America/Chicago',
        )
        mock_send_multi.assert_called_once()

    # ------------------------------------------------------------------
    # Success / failure / partial metadata updates
    # ------------------------------------------------------------------

    @patch('api.management.commands.send_scheduled_reports.timezone')
    @patch('api.management.commands.send_scheduled_reports.send_scheduled_reports_multi')
    @patch('api.management.commands.send_scheduled_reports.ReportSchedule')
    def test_success_updates_schedule_metadata(self, mock_model, mock_send_multi, mock_tz):
        """On success, last_run_at/status/error should be updated."""
        now = MagicMock()
        mock_tz.now.return_value = now

        schedule = self._make_schedule(report_types=['daily'])
        mock_qs = MagicMock()
        mock_qs.count.return_value = 1
        mock_qs.__iter__ = MagicMock(return_value=iter([schedule]))
        mock_model.objects.filter.return_value = mock_qs

        cmd = self._make_command()
        with patch.object(cmd, '_generate_report') as mock_gen:
            mock_gen.return_value = (BytesIO(b'x'), 'r.xlsx', 'Daily Sales Flash')
            cmd.handle(time='08:00', timezone='UTC', cron_expression=None)

        self.assertEqual(schedule.last_run_at, now)
        self.assertEqual(schedule.last_run_status, 'success')
        self.assertIsNone(schedule.last_run_error)
        schedule.save.assert_called_with(
            update_fields=['last_run_at', 'last_run_status', 'last_run_error']
        )

    @patch('api.management.commands.send_scheduled_reports.timezone')
    @patch('api.management.commands.send_scheduled_reports.send_scheduled_reports_multi')
    @patch('api.management.commands.send_scheduled_reports.ReportSchedule')
    def test_partial_failure_sends_remaining_and_records_partial(self, mock_model, mock_send_multi, mock_tz):
        """When one report type fails, remaining should still be sent with status='partial'."""
        now = MagicMock()
        mock_tz.now.return_value = now

        schedule = self._make_schedule(report_types=['daily', 'lp'])
        mock_qs = MagicMock()
        mock_qs.count.return_value = 1
        mock_qs.__iter__ = MagicMock(return_value=iter([schedule]))
        mock_model.objects.filter.return_value = mock_qs

        cmd = self._make_command()

        def gen_side_effect(report_type, tenant):
            if report_type == 'daily':
                raise Exception('DB connection lost')
            return (BytesIO(b'lp'), 'lp.xlsx', 'LP Risk Analysis')

        with patch.object(cmd, '_generate_report', side_effect=gen_side_effect):
            cmd.handle(time='08:00', timezone='UTC', cron_expression=None)

        # Email should still be sent with the successful report
        mock_send_multi.assert_called_once()
        call_kwargs = mock_send_multi.call_args[1]
        self.assertEqual(len(call_kwargs['attachments']), 1)
        self.assertEqual(call_kwargs['attachments'][0][0], 'lp.xlsx')

        # Status should be partial
        self.assertEqual(schedule.last_run_status, 'partial')
        self.assertIn('daily', schedule.last_run_error)
        self.assertIn('DB connection lost', schedule.last_run_error)

    @patch('api.management.commands.send_scheduled_reports.timezone')
    @patch('api.management.commands.send_scheduled_reports.send_scheduled_reports_multi')
    @patch('api.management.commands.send_scheduled_reports.ReportSchedule')
    def test_all_reports_fail_records_failed_no_email(self, mock_model, mock_send_multi, mock_tz):
        """When all report types fail, no email should be sent and status='failed'."""
        now = MagicMock()
        mock_tz.now.return_value = now

        schedule = self._make_schedule(report_types=['daily', 'weekly'])
        mock_qs = MagicMock()
        mock_qs.count.return_value = 1
        mock_qs.__iter__ = MagicMock(return_value=iter([schedule]))
        mock_model.objects.filter.return_value = mock_qs

        cmd = self._make_command()
        with patch.object(cmd, '_generate_report', side_effect=Exception('Generation failed')):
            cmd.handle(time='08:00', timezone='UTC', cron_expression=None)

        # No email should be sent
        mock_send_multi.assert_not_called()

        # Status should be failed
        self.assertEqual(schedule.last_run_status, 'failed')
        self.assertIn('daily', schedule.last_run_error)
        self.assertIn('weekly', schedule.last_run_error)

    # ------------------------------------------------------------------
    # Failure isolation (continue on error across schedules)
    # ------------------------------------------------------------------

    @patch('api.management.commands.send_scheduled_reports.timezone')
    @patch('api.management.commands.send_scheduled_reports.send_scheduled_reports_multi')
    @patch('api.management.commands.send_scheduled_reports.ReportSchedule')
    def test_failure_does_not_stop_remaining_schedules(self, mock_model, mock_send_multi, mock_tz):
        """If one schedule fails entirely, the rest should still be processed."""
        now = MagicMock()
        mock_tz.now.return_value = now

        s1 = self._make_schedule(report_types=['daily'], recipients=['fail@test.com'])
        s1.id = 1
        s2 = self._make_schedule(report_types=['daily'], recipients=['ok@test.com'])
        s2.id = 2

        mock_qs = MagicMock()
        mock_qs.count.return_value = 2
        mock_qs.__iter__ = MagicMock(return_value=iter([s1, s2]))
        mock_model.objects.filter.return_value = mock_qs

        cmd = self._make_command()
        call_count = [0]

        def gen_side_effect(report_type, tenant):
            call_count[0] += 1
            if call_count[0] == 1:
                raise Exception('First schedule fails')
            return (BytesIO(b'ok'), 'r.xlsx', 'Daily Sales Flash')

        with patch.object(cmd, '_generate_report', side_effect=gen_side_effect):
            cmd.handle(time='08:00', timezone='UTC', cron_expression=None)

        # Both schedules should have been attempted
        self.assertEqual(call_count[0], 2)
        # s1 all reports failed -> failed status set inside _execute_schedule
        self.assertEqual(s1.last_run_status, 'failed')
        self.assertEqual(s2.last_run_status, 'success')


class GenerateReportTests(SimpleTestCase):
    """Tests for the _generate_report dispatch method."""

    def _make_command(self):
        cmd = Command()
        cmd.stdout = MagicMock()
        cmd.stderr = MagicMock()
        return cmd

    def test_generate_report_dispatches_daily(self):
        """_generate_report should call _generate_daily_sales_report for 'daily'."""
        cmd = self._make_command()
        tenant = MagicMock()
        with patch.object(cmd, '_generate_daily_sales_report') as mock_daily:
            mock_daily.return_value = (BytesIO(b'x'), 'f.xlsx', 'Daily Sales Flash')
            result = cmd._generate_report('daily', tenant)
            mock_daily.assert_called_once()
            self.assertEqual(result[2], 'Daily Sales Flash')

    def test_generate_report_dispatches_weekly(self):
        """_generate_report should call _generate_weekly_sales_report for 'weekly'."""
        cmd = self._make_command()
        tenant = MagicMock()
        with patch.object(cmd, '_generate_weekly_sales_report') as mock_weekly:
            mock_weekly.return_value = (BytesIO(b'x'), 'f.xlsx', 'Weekly Sales Summary')
            result = cmd._generate_report('weekly', tenant)
            mock_weekly.assert_called_once()
            self.assertEqual(result[2], 'Weekly Sales Summary')

    def test_generate_report_dispatches_lp(self):
        """_generate_report should call _generate_lp_report for 'lp'."""
        cmd = self._make_command()
        tenant = MagicMock()
        with patch.object(cmd, '_generate_lp_report') as mock_lp:
            mock_lp.return_value = (BytesIO(b'x'), 'f.xlsx', 'LP Risk Analysis')
            result = cmd._generate_report('lp', tenant)
            mock_lp.assert_called_once()
            self.assertEqual(result[2], 'LP Risk Analysis')

    def test_generate_report_raises_for_unknown_type(self):
        """_generate_report should raise ValueError for unknown report types."""
        cmd = self._make_command()
        tenant = MagicMock()
        with self.assertRaises(ValueError) as ctx:
            cmd._generate_report('unknown', tenant)
        self.assertIn('Unknown report type', str(ctx.exception))

    @patch('api.management.commands.send_scheduled_reports.ExcelReportGenerator')
    @patch('api.management.commands.send_scheduled_reports.ReportMetric')
    @patch('api.management.commands.send_scheduled_reports.Store')
    def test_daily_report_scopes_to_tenant(self, mock_store, mock_metric, mock_gen_cls):
        """Daily report should filter stores and metrics by tenant."""
        cmd = self._make_command()
        tenant = MagicMock()

        mock_stores_qs = MagicMock()
        mock_store.objects.filter.return_value = mock_stores_qs

        mock_metrics_qs = MagicMock()
        mock_metrics_qs.__iter__ = MagicMock(return_value=iter([]))
        mock_metric.objects.filter.return_value = mock_metrics_qs

        mock_generator = MagicMock()
        mock_generator.generate_daily_report.return_value = BytesIO(b'excel')
        mock_gen_cls.return_value = mock_generator

        yesterday = date.today() - timedelta(days=1)
        result = cmd._generate_daily_sales_report(tenant, yesterday)

        mock_store.objects.filter.assert_called_once_with(
            tenant=tenant, status='active'
        )
        mock_metric.objects.filter.assert_called_once()
        filter_kwargs = mock_metric.objects.filter.call_args[1]
        self.assertEqual(filter_kwargs['store__in'], mock_stores_qs)
        self.assertEqual(filter_kwargs['report_type'], 'sales')

        self.assertEqual(result[2], 'Daily Sales Flash')

    @patch('api.management.commands.send_scheduled_reports.ExcelReportGenerator')
    @patch('api.management.commands.send_scheduled_reports.ReportMetric')
    @patch('api.management.commands.send_scheduled_reports.Store')
    def test_weekly_report_scopes_to_tenant(self, mock_store, mock_metric, mock_gen_cls):
        """Weekly report should filter stores and metrics by tenant."""
        cmd = self._make_command()
        tenant = MagicMock()

        mock_stores_qs = MagicMock()
        mock_store.objects.filter.return_value = mock_stores_qs

        mock_metrics_qs = MagicMock()
        mock_metrics_qs.__iter__ = MagicMock(return_value=iter([]))
        mock_metric.objects.filter.return_value = mock_metrics_qs

        mock_generator = MagicMock()
        mock_generator.generate_weekly_report.return_value = BytesIO(b'excel')
        mock_gen_cls.return_value = mock_generator

        end_date = date.today() - timedelta(days=1)
        start_date = end_date - timedelta(days=6)
        result = cmd._generate_weekly_sales_report(tenant, start_date, end_date)

        mock_store.objects.filter.assert_called_once_with(
            tenant=tenant, status='active'
        )
        filter_kwargs = mock_metric.objects.filter.call_args[1]
        self.assertEqual(filter_kwargs['store__in'], mock_stores_qs)
        self.assertEqual(filter_kwargs['report_date__gte'], start_date)
        self.assertEqual(filter_kwargs['report_date__lte'], end_date)

        self.assertEqual(result[2], 'Weekly Sales Summary')

    @patch('api.management.commands.send_scheduled_reports.Store')
    def test_lp_report_scopes_to_tenant(self, mock_store):
        """LP report should filter stores by tenant and pass tenant to LPService."""
        cmd = self._make_command()
        tenant = MagicMock()

        mock_stores_qs = MagicMock()
        mock_store.objects.filter.return_value = mock_stores_qs

        yesterday = date.today() - timedelta(days=1)

        with patch('api.services.lp_service.LPService') as mock_lp_cls:
            mock_lp = MagicMock()
            mock_lp.generate_lp_report_data.return_value = []
            mock_lp_cls.return_value = mock_lp

            result = cmd._generate_lp_report(tenant, yesterday)

        mock_store.objects.filter.assert_called_once_with(
            tenant=tenant, status='active'
        )
        self.assertEqual(result[2], 'LP Risk Analysis')


class PivotMetricsTests(SimpleTestCase):
    """Tests for the _pivot_metrics_to_rows helper."""

    def test_empty_metrics_returns_empty_list(self):
        """No metrics should produce an empty list."""
        cmd = Command()
        result = cmd._pivot_metrics_to_rows([])
        self.assertEqual(result, [])

    def test_groups_by_store_and_date(self):
        """Metrics for the same store/date should be grouped into one row."""
        cmd = Command()

        m1 = MagicMock()
        m1.store = MagicMock()
        m1.store.name = 'Store A'
        m1.store_id = 1
        m1.report_date = date(2024, 1, 15)
        m1.metric_name = 'Total Sales'
        m1.metric_value = 1000.0

        m2 = MagicMock()
        m2.store = m1.store
        m2.store_id = 1
        m2.report_date = date(2024, 1, 15)
        m2.metric_name = 'Total Net'
        m2.metric_value = 900.0

        result = cmd._pivot_metrics_to_rows([m1, m2])
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['Center Name'], 'Store A')
        self.assertEqual(result[0]['Total Sales'], 1000.0)
        self.assertEqual(result[0]['Total Net'], 900.0)

    def test_sorts_by_store_name_then_date(self):
        """Rows should be sorted by Center Name, then Date."""
        cmd = Command()

        m1 = MagicMock()
        m1.store = MagicMock()
        m1.store.name = 'Store B'
        m1.store_id = 2
        m1.report_date = date(2024, 1, 15)
        m1.metric_name = 'Total Sales'
        m1.metric_value = 500.0

        m2 = MagicMock()
        m2.store = MagicMock()
        m2.store.name = 'Store A'
        m2.store_id = 1
        m2.report_date = date(2024, 1, 15)
        m2.metric_name = 'Total Sales'
        m2.metric_value = 1000.0

        result = cmd._pivot_metrics_to_rows([m1, m2])
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0]['Center Name'], 'Store A')
        self.assertEqual(result[1]['Center Name'], 'Store B')

    def test_ignores_unknown_metric_names(self):
        """Metrics with names not in METRIC_TO_COLUMN should be ignored."""
        cmd = Command()

        m1 = MagicMock()
        m1.store = MagicMock()
        m1.store.name = 'Store A'
        m1.store_id = 1
        m1.report_date = date(2024, 1, 15)
        m1.metric_name = 'Unknown Metric'
        m1.metric_value = 999.0

        result = cmd._pivot_metrics_to_rows([m1])
        self.assertEqual(len(result), 1)
        self.assertNotIn('Unknown Metric', result[0])
