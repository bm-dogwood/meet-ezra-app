"""Unit tests for ReportScheduleSerializer validation methods."""

from django.test import SimpleTestCase
from rest_framework import serializers as drf_serializers

from api.serializers import ReportScheduleSerializer


class ReportScheduleSerializerFieldsTest(SimpleTestCase):
    """Test that the serializer exposes the correct fields."""

    def test_fields_include_report_types(self):
        fields = ReportScheduleSerializer.Meta.fields
        self.assertIn('report_types', fields)

    def test_fields_include_cron_expression(self):
        fields = ReportScheduleSerializer.Meta.fields
        self.assertIn('cron_expression', fields)

    def test_fields_do_not_include_report_type_singular(self):
        fields = ReportScheduleSerializer.Meta.fields
        self.assertNotIn('report_type', fields)

    def test_read_only_fields(self):
        ro = ReportScheduleSerializer.Meta.read_only_fields
        for f in ['id', 'last_run_at', 'last_run_status', 'last_run_error', 'created_at', 'updated_at']:
            self.assertIn(f, ro)

    def test_schedule_time_in_fields(self):
        """schedule_time is kept for backward compat."""
        fields = ReportScheduleSerializer.Meta.fields
        self.assertIn('schedule_time', fields)

    def test_timezone_in_fields(self):
        fields = ReportScheduleSerializer.Meta.fields
        self.assertIn('timezone', fields)


class ValidateReportTypesTest(SimpleTestCase):
    """Tests for ReportScheduleSerializer.validate_report_types."""

    def setUp(self):
        self.serializer = ReportScheduleSerializer()

    def test_single_valid_type_daily(self):
        result = self.serializer.validate_report_types(['daily'])
        self.assertEqual(result, ['daily'])

    def test_single_valid_type_weekly(self):
        result = self.serializer.validate_report_types(['weekly'])
        self.assertEqual(result, ['weekly'])

    def test_single_valid_type_lp(self):
        result = self.serializer.validate_report_types(['lp'])
        self.assertEqual(result, ['lp'])

    def test_multiple_valid_types(self):
        result = self.serializer.validate_report_types(['daily', 'weekly', 'lp'])
        self.assertEqual(sorted(result), ['daily', 'lp', 'weekly'])

    def test_deduplicates(self):
        result = self.serializer.validate_report_types(['daily', 'daily', 'lp'])
        self.assertEqual(sorted(result), ['daily', 'lp'])

    def test_empty_list_rejected(self):
        with self.assertRaises(drf_serializers.ValidationError) as ctx:
            self.serializer.validate_report_types([])
        self.assertIn("Must select at least one report type", str(ctx.exception))

    def test_not_a_list_rejected(self):
        with self.assertRaises(drf_serializers.ValidationError):
            self.serializer.validate_report_types('daily')

    def test_none_rejected(self):
        with self.assertRaises(drf_serializers.ValidationError):
            self.serializer.validate_report_types(None)

    def test_invalid_type_rejected(self):
        with self.assertRaises(drf_serializers.ValidationError) as ctx:
            self.serializer.validate_report_types(['daily', 'invalid'])
        self.assertIn("Invalid report type: invalid", str(ctx.exception))

    def test_all_invalid_types_rejected(self):
        with self.assertRaises(drf_serializers.ValidationError):
            self.serializer.validate_report_types(['foo', 'bar'])

    def test_all_three_types_valid(self):
        result = self.serializer.validate_report_types(['daily', 'weekly', 'lp'])
        self.assertEqual(len(result), 3)


class ValidateCronExpressionTest(SimpleTestCase):
    """Tests for ReportScheduleSerializer.validate_cron_expression."""

    def setUp(self):
        self.serializer = ReportScheduleSerializer()

    def test_valid_daily_expression(self):
        result = self.serializer.validate_cron_expression('0 8 * * *')
        self.assertEqual(result, '0 8 * * *')

    def test_valid_weekday_expression(self):
        result = self.serializer.validate_cron_expression('0 8 * * 1-5')
        self.assertEqual(result, '0 8 * * 1-5')

    def test_valid_all_wildcards(self):
        result = self.serializer.validate_cron_expression('* * * * *')
        self.assertEqual(result, '* * * * *')

    def test_valid_step_expression(self):
        result = self.serializer.validate_cron_expression('*/15 * * * *')
        self.assertEqual(result, '*/15 * * * *')

    def test_invalid_expression_rejected(self):
        with self.assertRaises(drf_serializers.ValidationError) as ctx:
            self.serializer.validate_cron_expression('bad cron')
        self.assertIn("Invalid cron expression", str(ctx.exception))

    def test_empty_string_rejected(self):
        with self.assertRaises(drf_serializers.ValidationError):
            self.serializer.validate_cron_expression('')

    def test_too_few_fields_rejected(self):
        with self.assertRaises(drf_serializers.ValidationError):
            self.serializer.validate_cron_expression('0 8 * *')

    def test_out_of_range_rejected(self):
        with self.assertRaises(drf_serializers.ValidationError):
            self.serializer.validate_cron_expression('60 * * * *')


class ValidateRecipientsTest(SimpleTestCase):
    """Tests for existing validate_recipients (should still work)."""

    def setUp(self):
        self.serializer = ReportScheduleSerializer()

    def test_valid_single_email(self):
        result = self.serializer.validate_recipients(['user@example.com'])
        self.assertEqual(result, ['user@example.com'])

    def test_valid_multiple_emails(self):
        emails = ['a@b.com', 'c@d.com', 'e@f.com']
        result = self.serializer.validate_recipients(emails)
        self.assertEqual(result, emails)

    def test_empty_list_rejected(self):
        with self.assertRaises(drf_serializers.ValidationError):
            self.serializer.validate_recipients([])

    def test_more_than_five_rejected(self):
        emails = [f'user{i}@example.com' for i in range(6)]
        with self.assertRaises(drf_serializers.ValidationError):
            self.serializer.validate_recipients(emails)

    def test_invalid_email_rejected(self):
        with self.assertRaises(drf_serializers.ValidationError):
            self.serializer.validate_recipients(['not-an-email'])


class ValidateTimezoneTest(SimpleTestCase):
    """Tests for existing validate_timezone (should still work)."""

    def setUp(self):
        self.serializer = ReportScheduleSerializer()

    def test_valid_timezone(self):
        result = self.serializer.validate_timezone('America/Chicago')
        self.assertEqual(result, 'America/Chicago')

    def test_utc_valid(self):
        result = self.serializer.validate_timezone('UTC')
        self.assertEqual(result, 'UTC')

    def test_invalid_timezone_rejected(self):
        with self.assertRaises(drf_serializers.ValidationError):
            self.serializer.validate_timezone('Invalid/Timezone')
