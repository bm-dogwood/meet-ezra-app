"""Unit tests for send_scheduled_report in email_service.py."""
from io import BytesIO
from unittest.mock import patch, MagicMock

from django.test import SimpleTestCase, override_settings

from api.email_service import send_scheduled_report


@override_settings(DEFAULT_FROM_EMAIL='test@ezra.com')
class SendScheduledReportTests(SimpleTestCase):
    """Tests for the send_scheduled_report function."""

    def _make_excel_bytes(self):
        """Create a fake BytesIO object simulating Excel content."""
        buf = BytesIO(b'\x00\x01\x02\x03fake-excel-content')
        return buf

    @patch('api.email_service.EmailMessage')
    def test_sends_email_with_correct_subject(self, mock_email_cls):
        """Email subject should include the report name."""
        mock_instance = MagicMock()
        mock_email_cls.return_value = mock_instance

        send_scheduled_report(
            recipients=['user@example.com'],
            report_name='Daily Sales Flash',
            excel_bytes=self._make_excel_bytes(),
            filename='daily_sales_flash_2024-01-15.xlsx',
        )

        mock_email_cls.assert_called_once()
        call_kwargs = mock_email_cls.call_args[1]
        self.assertEqual(call_kwargs['subject'], 'Ezra Portal - Daily Sales Flash')

    @patch('api.email_service.EmailMessage')
    def test_sends_to_all_recipients(self, mock_email_cls):
        """Email should be addressed to all provided recipients."""
        mock_instance = MagicMock()
        mock_email_cls.return_value = mock_instance

        recipients = ['a@example.com', 'b@example.com', 'c@example.com']
        send_scheduled_report(
            recipients=recipients,
            report_name='Weekly Sales Summary',
            excel_bytes=self._make_excel_bytes(),
            filename='weekly_summary.xlsx',
        )

        call_kwargs = mock_email_cls.call_args[1]
        self.assertEqual(call_kwargs['to'], recipients)

    @patch('api.email_service.EmailMessage')
    def test_attaches_excel_with_correct_mime_type(self, mock_email_cls):
        """Attachment should use the correct Excel MIME type."""
        mock_instance = MagicMock()
        mock_email_cls.return_value = mock_instance

        excel_bytes = self._make_excel_bytes()
        send_scheduled_report(
            recipients=['user@example.com'],
            report_name='LP Risk Analysis',
            excel_bytes=excel_bytes,
            filename='lp_risk_2024-01-15.xlsx',
        )

        mock_instance.attach.assert_called_once_with(
            'lp_risk_2024-01-15.xlsx',
            excel_bytes.getvalue(),
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        )

    @patch('api.email_service.EmailMessage')
    def test_sets_html_content_subtype(self, mock_email_cls):
        """Email content_subtype should be set to 'html'."""
        mock_instance = MagicMock()
        mock_email_cls.return_value = mock_instance

        send_scheduled_report(
            recipients=['user@example.com'],
            report_name='Daily Sales Flash',
            excel_bytes=self._make_excel_bytes(),
            filename='report.xlsx',
        )

        self.assertEqual(mock_instance.content_subtype, 'html')

    @patch('api.email_service.EmailMessage')
    def test_calls_send(self, mock_email_cls):
        """email.send() should be called with fail_silently=False."""
        mock_instance = MagicMock()
        mock_email_cls.return_value = mock_instance

        send_scheduled_report(
            recipients=['user@example.com'],
            report_name='Daily Sales Flash',
            excel_bytes=self._make_excel_bytes(),
            filename='report.xlsx',
        )

        mock_instance.send.assert_called_once_with(fail_silently=False)

    @patch('api.email_service.EmailMessage')
    def test_returns_success_tuple(self, mock_email_cls):
        """Should return (True, 'Report sent successfully') on success."""
        mock_instance = MagicMock()
        mock_email_cls.return_value = mock_instance

        success, message = send_scheduled_report(
            recipients=['user@example.com'],
            report_name='Daily Sales Flash',
            excel_bytes=self._make_excel_bytes(),
            filename='report.xlsx',
        )

        self.assertTrue(success)
        self.assertEqual(message, 'Report sent successfully')

    @patch('api.email_service.EmailMessage')
    def test_returns_failure_on_exception(self, mock_email_cls):
        """Should return (False, error_message) when sending fails."""
        mock_instance = MagicMock()
        mock_instance.send.side_effect = Exception('SMTP connection refused')
        mock_email_cls.return_value = mock_instance

        success, message = send_scheduled_report(
            recipients=['user@example.com'],
            report_name='Daily Sales Flash',
            excel_bytes=self._make_excel_bytes(),
            filename='report.xlsx',
        )

        self.assertFalse(success)
        self.assertIn('SMTP connection refused', message)

    @patch('api.email_service.EmailMessage')
    def test_html_body_contains_report_name(self, mock_email_cls):
        """HTML body should contain the report name."""
        mock_instance = MagicMock()
        mock_email_cls.return_value = mock_instance

        send_scheduled_report(
            recipients=['user@example.com'],
            report_name='Weekly Sales Summary',
            excel_bytes=self._make_excel_bytes(),
            filename='weekly.xlsx',
        )

        call_kwargs = mock_email_cls.call_args[1]
        self.assertIn('Weekly Sales Summary', call_kwargs['body'])

    @patch('api.email_service.EmailMessage')
    def test_uses_default_from_email(self, mock_email_cls):
        """Should use settings.DEFAULT_FROM_EMAIL as the sender."""
        mock_instance = MagicMock()
        mock_email_cls.return_value = mock_instance

        send_scheduled_report(
            recipients=['user@example.com'],
            report_name='Daily Sales Flash',
            excel_bytes=self._make_excel_bytes(),
            filename='report.xlsx',
        )

        call_kwargs = mock_email_cls.call_args[1]
        self.assertEqual(call_kwargs['from_email'], 'test@ezra.com')


from api.email_service import send_scheduled_reports_multi


@override_settings(DEFAULT_FROM_EMAIL='test@ezra.com')
class SendScheduledReportsMultiTests(SimpleTestCase):
    """Tests for the send_scheduled_reports_multi function."""

    def _make_excel_bytes(self, content=b'\x00\x01fake-excel'):
        return BytesIO(content)

    def _make_attachments(self, count=2):
        """Build a list of (filename, excel_bytes, report_name) tuples."""
        names = [
            ('daily_sales_2024-01-15.xlsx', 'Daily Sales Flash'),
            ('weekly_summary_2024-01-15.xlsx', 'Weekly Sales Summary'),
            ('lp_risk_2024-01-15.xlsx', 'LP Risk Analysis'),
        ]
        return [
            (names[i][0], self._make_excel_bytes(), names[i][1])
            for i in range(count)
        ]

    @patch('api.email_service.EmailMessage')
    def test_subject_lists_all_report_names(self, mock_email_cls):
        mock_instance = MagicMock()
        mock_email_cls.return_value = mock_instance

        attachments = self._make_attachments(3)
        send_scheduled_reports_multi(['u@example.com'], attachments)

        call_kwargs = mock_email_cls.call_args[1]
        self.assertEqual(
            call_kwargs['subject'],
            'Ezra Portal - Daily Sales Flash, Weekly Sales Summary, LP Risk Analysis',
        )

    @patch('api.email_service.EmailMessage')
    def test_subject_single_report(self, mock_email_cls):
        mock_instance = MagicMock()
        mock_email_cls.return_value = mock_instance

        attachments = self._make_attachments(1)
        send_scheduled_reports_multi(['u@example.com'], attachments)

        call_kwargs = mock_email_cls.call_args[1]
        self.assertEqual(call_kwargs['subject'], 'Ezra Portal - Daily Sales Flash')

    @patch('api.email_service.EmailMessage')
    def test_sends_to_all_recipients(self, mock_email_cls):
        mock_instance = MagicMock()
        mock_email_cls.return_value = mock_instance

        recipients = ['a@example.com', 'b@example.com']
        send_scheduled_reports_multi(recipients, self._make_attachments(1))

        call_kwargs = mock_email_cls.call_args[1]
        self.assertEqual(call_kwargs['to'], recipients)

    @patch('api.email_service.EmailMessage')
    def test_attaches_all_files_with_xlsx_mime(self, mock_email_cls):
        mock_instance = MagicMock()
        mock_email_cls.return_value = mock_instance

        attachments = self._make_attachments(2)
        send_scheduled_reports_multi(['u@example.com'], attachments)

        xlsx_mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        self.assertEqual(mock_instance.attach.call_count, 2)
        for i, call in enumerate(mock_instance.attach.call_args_list):
            fname, data, mime = call.args
            self.assertEqual(fname, attachments[i][0])
            self.assertEqual(data, attachments[i][1].getvalue())
            self.assertEqual(mime, xlsx_mime)

    @patch('api.email_service.EmailMessage')
    def test_sets_html_content_subtype(self, mock_email_cls):
        mock_instance = MagicMock()
        mock_email_cls.return_value = mock_instance

        send_scheduled_reports_multi(['u@example.com'], self._make_attachments(1))

        self.assertEqual(mock_instance.content_subtype, 'html')

    @patch('api.email_service.EmailMessage')
    def test_calls_send(self, mock_email_cls):
        mock_instance = MagicMock()
        mock_email_cls.return_value = mock_instance

        send_scheduled_reports_multi(['u@example.com'], self._make_attachments(1))

        mock_instance.send.assert_called_once_with(fail_silently=False)

    @patch('api.email_service.EmailMessage')
    def test_returns_success_tuple(self, mock_email_cls):
        mock_instance = MagicMock()
        mock_email_cls.return_value = mock_instance

        success, message = send_scheduled_reports_multi(
            ['u@example.com'], self._make_attachments(1),
        )

        self.assertTrue(success)
        self.assertEqual(message, 'Reports sent successfully')

    @patch('api.email_service.EmailMessage')
    def test_returns_failure_on_exception(self, mock_email_cls):
        mock_instance = MagicMock()
        mock_instance.send.side_effect = Exception('SMTP error')
        mock_email_cls.return_value = mock_instance

        success, message = send_scheduled_reports_multi(
            ['u@example.com'], self._make_attachments(1),
        )

        self.assertFalse(success)
        self.assertIn('SMTP error', message)

    @patch('api.email_service.EmailMessage')
    def test_html_body_lists_report_names(self, mock_email_cls):
        mock_instance = MagicMock()
        mock_email_cls.return_value = mock_instance

        attachments = self._make_attachments(2)
        send_scheduled_reports_multi(['u@example.com'], attachments)

        call_kwargs = mock_email_cls.call_args[1]
        body = call_kwargs['body']
        self.assertIn('Daily Sales Flash', body)
        self.assertIn('Weekly Sales Summary', body)

    @patch('api.email_service.EmailMessage')
    def test_uses_default_from_email(self, mock_email_cls):
        mock_instance = MagicMock()
        mock_email_cls.return_value = mock_instance

        send_scheduled_reports_multi(['u@example.com'], self._make_attachments(1))

        call_kwargs = mock_email_cls.call_args[1]
        self.assertEqual(call_kwargs['from_email'], 'test@ezra.com')
