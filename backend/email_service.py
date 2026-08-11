"""Resend email notification service."""
import os
import asyncio
import logging
from html import escape as _html_escape
import resend

logger = logging.getLogger(__name__)


def _configure():
    api_key = os.environ.get("RESEND_API_KEY", "")
    if api_key:
        resend.api_key = api_key


async def send_admin_notification(subject: str, html: str) -> dict:
    """Send an HTML email to the admin notify email. Non-blocking (uses to_thread)."""
    _configure()
    to_email = os.environ.get("ADMIN_NOTIFY_EMAIL", "")
    sender = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
    if not resend.api_key or not to_email:
        logger.warning("Resend not configured; skipping notification email")
        return {"status": "skipped", "reason": "not_configured"}

    params = {
        "from": sender,
        "to": [to_email],
        "subject": subject,
        "html": html,
    }
    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        return {"status": "sent", "id": email.get("id") if isinstance(email, dict) else None}
    except Exception as e:
        logger.error(f"Resend send failed: {e}")
        return {"status": "error", "error": str(e)}


def build_login_email_html(user_name: str, user_email: str, watched_count: int, total: int) -> str:
    percent = int((watched_count / total) * 100) if total else 0
    safe_name = _html_escape(user_name or "")
    safe_email = _html_escape(user_email or "")
    return f"""
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background:#FDFBF7; padding:24px; border:1px solid #eab30833; border-radius:12px;">
      <h2 style="color:#0f172a; margin:0 0 8px;">🔔 Pengguna Login ke Karir Siap Kerja</h2>
      <p style="color:#475569; font-size:14px; margin:0 0 20px;">HCG Teams Notification</p>
      <table style="width:100%; border-collapse:collapse; background:white; border-radius:10px; overflow:hidden; border:1px solid #e2e8f0;">
        <tr style="background:#fef3c7;"><td style="padding:12px; font-weight:bold; color:#78350f;">Nama</td><td style="padding:12px; color:#1e293b;">{safe_name}</td></tr>
        <tr><td style="padding:12px; font-weight:bold; color:#78350f; border-top:1px solid #e2e8f0;">Email</td><td style="padding:12px; color:#1e293b; border-top:1px solid #e2e8f0;">{safe_email}</td></tr>
        <tr style="background:#fef3c7;"><td style="padding:12px; font-weight:bold; color:#78350f;">Video Ditonton</td><td style="padding:12px; color:#1e293b;">{watched_count} / {total}</td></tr>
        <tr><td style="padding:12px; font-weight:bold; color:#78350f; border-top:1px solid #e2e8f0;">Progres</td><td style="padding:12px; color:#059669; font-weight:bold; border-top:1px solid #e2e8f0;">{percent}%</td></tr>
      </table>
      <p style="color:#64748b; font-size:12px; margin-top:24px;">Email otomatis dari platform Karir Siap Kerja • HCG Teams © 2026</p>
    </div>
    """


def build_progress_email_html(user_name: str, user_email: str, video_title: str, watched_count: int, total: int) -> str:
    percent = int((watched_count / total) * 100) if total else 0
    safe_name = _html_escape(user_name or "")
    safe_email = _html_escape(user_email or "")
    safe_title = _html_escape(video_title or "")
    completed_badge = "🏆 <b>Selamat! Sudah menonton SEMUA video!</b>" if percent == 100 else f"Progres saat ini: <b>{percent}%</b>"
    return f"""
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background:#FDFBF7; padding:24px; border:1px solid #10b98133; border-radius:12px;">
      <h2 style="color:#0f172a; margin:0 0 8px;">✅ Progres Belajar Baru</h2>
      <p style="color:#475569; font-size:14px; margin:0 0 20px;">HCG Teams Notification</p>
      <table style="width:100%; border-collapse:collapse; background:white; border-radius:10px; overflow:hidden; border:1px solid #e2e8f0;">
        <tr style="background:#d1fae5;"><td style="padding:12px; font-weight:bold; color:#065f46;">Pengguna</td><td style="padding:12px; color:#1e293b;">{safe_name} ({safe_email})</td></tr>
        <tr><td style="padding:12px; font-weight:bold; color:#065f46; border-top:1px solid #e2e8f0;">Video Ditonton</td><td style="padding:12px; color:#1e293b; border-top:1px solid #e2e8f0;">{safe_title}</td></tr>
        <tr style="background:#d1fae5;"><td style="padding:12px; font-weight:bold; color:#065f46;">Total Progres</td><td style="padding:12px; color:#059669; font-weight:bold;">{watched_count} / {total} video ({percent}%)</td></tr>
      </table>
      <p style="text-align:center; margin:20px 0; font-size:15px; color:#065f46;">{completed_badge}</p>
      <p style="color:#64748b; font-size:12px; margin-top:24px;">Email otomatis dari platform Karir Siap Kerja • HCG Teams © 2026</p>
    </div>
    """
