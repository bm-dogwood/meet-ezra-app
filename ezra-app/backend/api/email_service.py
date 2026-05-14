from django.core.mail import send_mail, EmailMessage
from django.conf import settings
from django.template.loader import render_to_string
import logging
import random
import string

logger = logging.getLogger(__name__)


def generate_otp(length=6):
    """Generate a random numeric OTP"""
    return ''.join(random.choices(string.digits, k=length))


def send_password_reset_otp(email, otp):
    """Send OTP email for password reset"""
    try:
        subject = "Ezra Portal - Password Reset OTP"
        
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }}
                .container {{ background: #fff; padding: 30px; border-radius: 10px; border: 1px solid #ddd; }}
                .header {{ text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 20px; }}
                .header h1 {{ color: #007bff; margin: 0; }}
                .otp-box {{ background: #f8f9fa; padding: 20px; text-align: center; border-left: 4px solid #007bff; margin: 20px 0; }}
                .otp-code {{ font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #007bff; }}
                .warning {{ background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header"><h1>Password Reset Request</h1></div>
                <p>You have requested to reset your password for your Ezra Portal account.</p>
                <p>Use the following OTP to complete your password reset:</p>
                <div class="otp-box">
                    <p class="otp-code">{otp}</p>
                </div>
                <div class="warning">
                    <strong>Important:</strong> This OTP is valid for 10 minutes only. Do not share this code with anyone.
                </div>
                <p>If you did not request this password reset, please ignore this email or contact support if you have concerns.</p>
            </div>
        </body>
        </html>
        """
        
        plain_message = f"""
        Password Reset Request
        
        You have requested to reset your password for your Ezra Portal account.
        
        Your OTP: {otp}
        
        This OTP is valid for 10 minutes only.
        
        If you did not request this password reset, please ignore this email.
        """
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f"Password reset OTP sent to {email}")
        return True, "OTP sent successfully"
        
    except Exception as e:
        logger.error(f"Failed to send password reset OTP to {email}: {str(e)}")
        return False, str(e)


def send_user_invitation_email(user, temporary_password):
    """Send invitation email to newly created user via Django Admin"""
    try:
        user_name = user.get_full_name() or user.username
        role_display = {
            'franchisor_admin': 'Franchise Admin',
            'franchise_user': 'Franchise User',
            'super_admin': 'Super Admin'
        }.get(user.role, user.role.replace('_', ' ').title())
        
        tenant_name = user.tenant.name if user.tenant else None
        admin_url = settings.ADMIN_URL
        frontend_url = settings.FRONTEND_URL
        
        # Use frontend URL for franchisee users, admin URL for others
        login_url = frontend_url if user.role == 'franchise_user' else admin_url
        
        subject = "Welcome to Ezra Portal - Your Account Invitation"
        
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }}
                .container {{ background: #fff; padding: 30px; border-radius: 10px; border: 1px solid #ddd; }}
                .header {{ text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 20px; }}
                .header h1 {{ color: #007bff; margin: 0; }}
                .credentials {{ background: #f8f9fa; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0; }}
                .btn {{ display: inline-block; padding: 12px 30px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }}
                .warning {{ background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header"><h1>Welcome to Ezra Portal</h1></div>
                <p>Dear <strong>{user_name}</strong>,</p>
                <p>Your account has been created. You have been assigned the role of <strong>{role_display}</strong>.</p>
                {"<p><strong>Organization:</strong> " + tenant_name + "</p>" if tenant_name else ""}
                <div class="credentials">
                    <h3>Your Login Credentials</h3>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Temporary Password:</strong> <code>{temporary_password}</code></p>
                </div>
                <div class="warning">
                    <strong>Important:</strong> Please change your password after first login.
                </div>
                <p>Access your dashboard:</p>
                <p><a href="{login_url}" class="btn">Login to Ezra Portal</a></p>
                <p>URL: {login_url}</p>
            </div>
        </body>
        </html>
        """
        
        plain_message = f"""
        Welcome to Ezra Portal!
        
        Dear {user_name},
        
        Your account has been created with role: {role_display}
        {"Organization: " + tenant_name if tenant_name else ""}
        
        Login Credentials:
        - Username: {user.username}
        - Email: {user.email}
        - Temporary Password: {temporary_password}
        
        Please change your password after first login.
        
        Login URL: {login_url}
        """
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        logger.info(f"Invitation email sent to {user.email}")
        return True, f"Email sent to {user.email}"
        
    except Exception as e:
        logger.error(f"Failed to send invitation email to {user.email}: {str(e)}")
        return False, str(e)

def send_scheduled_report(recipients, report_name, excel_bytes, filename):
    """Send a scheduled report email with an Excel attachment to the given recipients.

    Args:
        recipients: List of email addresses to send the report to.
        report_name: Display name of the report (e.g. 'Daily Sales Flash').
        excel_bytes: BytesIO object containing the Excel file data.
        filename: Filename for the attachment (e.g. 'daily_sales_flash_2024-01-15.xlsx').

    Returns:
        Tuple of (success: bool, message: str).
    """
    try:
        subject = f"Ezra Portal - {report_name}"

        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }}
                .container {{ background: #fff; padding: 30px; border-radius: 10px; border: 1px solid #ddd; }}
                .header {{ text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 20px; }}
                .header h1 {{ color: #007bff; margin: 0; }}
                .info {{ background: #f8f9fa; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0; }}
                .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header"><h1>Scheduled Report Delivery</h1></div>
                <p>Your scheduled report is ready.</p>
                <div class="info">
                    <h3>{report_name}</h3>
                    <p>Please find the report attached as an Excel file.</p>
                    <p><strong>Attachment:</strong> {filename}</p>
                </div>
                <p>This report was automatically generated and delivered by the Ezra Portal scheduling system.</p>
                <div class="footer">
                    <p>This is an automated email from Ezra Portal. If you believe you received this in error, please contact your administrator.</p>
                </div>
            </div>
        </body>
        </html>
        """

        plain_message = f"""
        Scheduled Report Delivery

        Your scheduled report is ready.

        Report: {report_name}
        Attachment: {filename}

        Please find the report attached as an Excel file.

        This report was automatically generated and delivered by the Ezra Portal scheduling system.
        """

        email = EmailMessage(
            subject=subject,
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=recipients,
        )
        email.content_subtype = 'html'
        email.attach(
            filename,
            excel_bytes.getvalue(),
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        )
        email.send(fail_silently=False)

        logger.info(f"Scheduled report '{report_name}' sent to {', '.join(recipients)}")
        return True, "Report sent successfully"

    except Exception as e:
        logger.error(f"Failed to send scheduled report '{report_name}' to {', '.join(recipients)}: {str(e)}")
        return False, str(e)



def send_scheduled_reports_multi(recipients, attachments):
    """Send a single email with multiple report attachments.

    Args:
        recipients: List of email addresses.
        attachments: List of (filename, excel_bytes, report_name) tuples.

    Returns:
        Tuple of (success: bool, message: str).
    """
    try:
        report_names = [a[2] for a in attachments]
        subject = f"Ezra Portal - {', '.join(report_names)}"

        attachment_rows = ''.join(
            f"<li><strong>{name}</strong> &mdash; {fname}</li>"
            for fname, _, name in attachments
        )

        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }}
                .container {{ background: #fff; padding: 30px; border-radius: 10px; border: 1px solid #ddd; }}
                .header {{ text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 20px; }}
                .header h1 {{ color: #007bff; margin: 0; }}
                .info {{ background: #f8f9fa; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0; }}
                .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header"><h1>Scheduled Report Delivery</h1></div>
                <p>Your scheduled reports are ready.</p>
                <div class="info">
                    <h3>Reports Included</h3>
                    <ul>{attachment_rows}</ul>
                </div>
                <p>This report was automatically generated and delivered by the Ezra Portal scheduling system.</p>
                <div class="footer">
                    <p>This is an automated email from Ezra Portal. If you believe you received this in error, please contact your administrator.</p>
                </div>
            </div>
        </body>
        </html>
        """

        xlsx_content_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

        email = EmailMessage(
            subject=subject,
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=recipients,
        )
        email.content_subtype = 'html'
        for filename, excel_bytes, _ in attachments:
            email.attach(filename, excel_bytes.getvalue(), xlsx_content_type)
        email.send(fail_silently=False)

        logger.info(
            f"Scheduled reports ({', '.join(report_names)}) sent to {', '.join(recipients)}"
        )
        return True, "Reports sent successfully"

    except Exception as e:
        report_names = [a[2] for a in attachments]
        logger.error(
            f"Failed to send scheduled reports ({', '.join(report_names)}) "
            f"to {', '.join(recipients)}: {str(e)}"
        )
        return False, str(e)

