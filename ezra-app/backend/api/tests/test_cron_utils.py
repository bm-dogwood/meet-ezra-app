"""Unit tests for api.utils.cron_utils module."""

from django.test import SimpleTestCase

from api.utils.cron_utils import (
    build_cron_expression,
    cron_to_human_readable,
    local_cron_to_utc,
    validate_cron_expression,
)


class ValidateCronExpressionTests(SimpleTestCase):
    """Tests for validate_cron_expression."""

    def test_valid_all_wildcards(self):
        self.assertTrue(validate_cron_expression('* * * * *'))

    def test_valid_fixed_time_daily(self):
        self.assertTrue(validate_cron_expression('0 8 * * *'))

    def test_valid_midnight(self):
        self.assertTrue(validate_cron_expression('0 0 * * *'))

    def test_valid_end_of_range(self):
        self.assertTrue(validate_cron_expression('59 23 31 12 7'))

    def test_valid_step(self):
        self.assertTrue(validate_cron_expression('*/15 * * * *'))

    def test_valid_range(self):
        self.assertTrue(validate_cron_expression('0 8 * * 1-5'))

    def test_valid_list(self):
        self.assertTrue(validate_cron_expression('0 8 * * 1,3,5'))

    def test_valid_range_with_step(self):
        self.assertTrue(validate_cron_expression('0 1-23/2 * * *'))

    def test_valid_complex(self):
        self.assertTrue(validate_cron_expression('0,30 9-17 * * 1-5'))

    def test_valid_first_of_year(self):
        self.assertTrue(validate_cron_expression('0 0 1 1 *'))

    def test_valid_sunday_as_zero(self):
        self.assertTrue(validate_cron_expression('0 8 * * 0'))

    def test_valid_sunday_as_seven(self):
        self.assertTrue(validate_cron_expression('0 8 * * 7'))

    def test_invalid_minute_60(self):
        self.assertFalse(validate_cron_expression('60 * * * *'))

    def test_invalid_hour_24(self):
        self.assertFalse(validate_cron_expression('0 24 * * *'))

    def test_invalid_dom_0(self):
        self.assertFalse(validate_cron_expression('0 0 0 * *'))

    def test_invalid_dom_32(self):
        self.assertFalse(validate_cron_expression('0 0 32 * *'))

    def test_invalid_month_0(self):
        self.assertFalse(validate_cron_expression('0 0 * 0 *'))

    def test_invalid_month_13(self):
        self.assertFalse(validate_cron_expression('0 0 * 13 *'))

    def test_invalid_dow_8(self):
        self.assertFalse(validate_cron_expression('0 0 * * 8'))

    def test_invalid_too_few_fields(self):
        self.assertFalse(validate_cron_expression('0 8 * *'))

    def test_invalid_too_many_fields(self):
        self.assertFalse(validate_cron_expression('0 8 * * * *'))

    def test_invalid_empty_string(self):
        self.assertFalse(validate_cron_expression(''))

    def test_invalid_non_string(self):
        self.assertFalse(validate_cron_expression(None))

    def test_invalid_letters(self):
        self.assertFalse(validate_cron_expression('a b c d e'))

    def test_invalid_reversed_range(self):
        self.assertFalse(validate_cron_expression('0 8 * * 5-1'))

    def test_invalid_step_zero(self):
        self.assertFalse(validate_cron_expression('*/0 * * * *'))

    def test_invalid_negative(self):
        self.assertFalse(validate_cron_expression('-1 * * * *'))

    def test_whitespace_handling(self):
        self.assertTrue(validate_cron_expression('  0 8 * * *  '))


class LocalCronToUtcTests(SimpleTestCase):
    """Tests for local_cron_to_utc."""

    def test_utc_passthrough(self):
        self.assertEqual(local_cron_to_utc('0 8 * * *', 'UTC'), '0 8 * * *')

    def test_chicago_to_utc(self):
        # CST is UTC-6, so 8:00 CST -> 14:00 UTC
        result = local_cron_to_utc('0 8 * * *', 'America/Chicago')
        self.assertEqual(result, '0 14 * * *')

    def test_tokyo_to_utc(self):
        # JST is UTC+9, so 9:00 JST -> 0:00 UTC
        result = local_cron_to_utc('0 9 * * *', 'Asia/Tokyo')
        self.assertEqual(result, '0 0 * * *')

    def test_complex_hour_passthrough(self):
        # Wildcard in hour field -> pass through
        result = local_cron_to_utc('0 */2 * * *', 'America/Chicago')
        self.assertEqual(result, '0 */2 * * *')

    def test_complex_minute_passthrough(self):
        # Step in minute field -> pass through
        result = local_cron_to_utc('*/15 8 * * *', 'America/Chicago')
        self.assertEqual(result, '*/15 8 * * *')

    def test_preserves_other_fields(self):
        result = local_cron_to_utc('0 8 * * 1-5', 'America/Chicago')
        self.assertEqual(result, '0 14 * * 1-5')

    def test_invalid_timezone_passthrough(self):
        result = local_cron_to_utc('0 8 * * *', 'Invalid/Timezone')
        self.assertEqual(result, '0 8 * * *')

    def test_invalid_expression_passthrough(self):
        result = local_cron_to_utc('bad', 'UTC')
        self.assertEqual(result, 'bad')

    def test_minute_conversion(self):
        # India is UTC+5:30, so 8:30 IST -> 3:00 UTC
        result = local_cron_to_utc('30 8 * * *', 'Asia/Kolkata')
        self.assertEqual(result, '0 3 * * *')


class CronToHumanReadableTests(SimpleTestCase):
    """Tests for cron_to_human_readable."""

    def test_daily_morning(self):
        result = cron_to_human_readable('0 8 * * *', 'UTC')
        self.assertEqual(result, 'Every day at 8:00 AM UTC')

    def test_weekdays(self):
        result = cron_to_human_readable('0 8 * * 1-5', 'UTC')
        self.assertEqual(result, 'Every weekday at 8:00 AM UTC')

    def test_specific_days(self):
        result = cron_to_human_readable('30 9 * * 1,3', 'UTC')
        self.assertEqual(result, 'Every Mon, Wed at 9:30 AM UTC')

    def test_monthly(self):
        result = cron_to_human_readable('0 7 15 * *', 'UTC')
        self.assertEqual(result, 'On the 15th of every month at 7:00 AM UTC')

    def test_midnight(self):
        result = cron_to_human_readable('0 0 * * *', 'UTC')
        self.assertEqual(result, 'Every day at 12:00 AM UTC')

    def test_noon(self):
        result = cron_to_human_readable('0 12 * * *', 'UTC')
        self.assertEqual(result, 'Every day at 12:00 PM UTC')

    def test_pm_time(self):
        result = cron_to_human_readable('0 17 * * *', 'UTC')
        self.assertEqual(result, 'Every day at 5:00 PM UTC')

    def test_first_of_month(self):
        result = cron_to_human_readable('0 8 1 * *', 'UTC')
        self.assertEqual(result, 'On the 1st of every month at 8:00 AM UTC')

    def test_second_of_month(self):
        result = cron_to_human_readable('0 8 2 * *', 'UTC')
        self.assertEqual(result, 'On the 2nd of every month at 8:00 AM UTC')

    def test_third_of_month(self):
        result = cron_to_human_readable('0 8 3 * *', 'UTC')
        self.assertEqual(result, 'On the 3rd of every month at 8:00 AM UTC')

    def test_with_timezone(self):
        result = cron_to_human_readable('0 8 * * *', 'America/Chicago')
        self.assertIn('8:00 AM', result)
        self.assertIn('CST', result)

    def test_invalid_expression(self):
        result = cron_to_human_readable('bad', 'UTC')
        self.assertEqual(result, 'bad')


class BuildCronExpressionTests(SimpleTestCase):
    """Tests for build_cron_expression."""

    def test_daily(self):
        result = build_cron_expression('daily', hour=8, minute=0)
        self.assertEqual(result, '0 8 * * *')

    def test_daily_with_minute(self):
        result = build_cron_expression('daily', hour=9, minute=30)
        self.assertEqual(result, '30 9 * * *')

    def test_weekdays(self):
        result = build_cron_expression('weekdays', hour=8, minute=0)
        self.assertEqual(result, '0 8 * * 1-5')

    def test_specific_days(self):
        result = build_cron_expression('specific_days', days=[1, 3, 5], hour=9, minute=15)
        self.assertEqual(result, '15 9 * * 1,3,5')

    def test_specific_days_sorted(self):
        result = build_cron_expression('specific_days', days=[5, 1, 3], hour=8, minute=0)
        self.assertEqual(result, '0 8 * * 1,3,5')

    def test_specific_days_deduped(self):
        result = build_cron_expression('specific_days', days=[1, 1, 3], hour=8, minute=0)
        self.assertEqual(result, '0 8 * * 1,3')

    def test_monthly(self):
        result = build_cron_expression('monthly', day_of_month=15, hour=7, minute=0)
        self.assertEqual(result, '0 7 15 * *')

    def test_monthly_first(self):
        result = build_cron_expression('monthly', day_of_month=1, hour=8, minute=0)
        self.assertEqual(result, '0 8 1 * *')

    def test_invalid_frequency(self):
        with self.assertRaises(ValueError):
            build_cron_expression('hourly', hour=8, minute=0)

    def test_specific_days_no_days(self):
        with self.assertRaises(ValueError):
            build_cron_expression('specific_days', hour=8, minute=0)

    def test_monthly_no_day(self):
        with self.assertRaises(ValueError):
            build_cron_expression('monthly', hour=8, minute=0)

    def test_all_results_are_valid(self):
        """Every build_cron_expression output should pass validation."""
        cases = [
            build_cron_expression('daily', hour=0, minute=0),
            build_cron_expression('weekdays', hour=23, minute=45),
            build_cron_expression('specific_days', days=[0, 3, 6], hour=12, minute=30),
            build_cron_expression('monthly', day_of_month=28, hour=6, minute=15),
        ]
        for expr in cases:
            with self.subTest(expr=expr):
                self.assertTrue(validate_cron_expression(expr))
