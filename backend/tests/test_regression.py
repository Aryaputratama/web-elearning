"""Regression tests after database.py refactor.
Covers auth, tracking, admin, and templates endpoints.
"""
import os
import sys
import time
from pathlib import Path
import pytest
import requests
from dotenv import load_dotenv

# Ensure backend/ is on sys.path so `from email_service import ...` works in tests
sys.path.insert(0, str(Path(__file__).parent.parent))

# Load backend .env so ADMIN_EMAIL/ADMIN_PASSWORD/MONGO_URL/DB_NAME are available
load_dotenv(Path(__file__).parent.parent / ".env")

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://career-boost-410.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "aryaputratama68@gmail.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD")
if not ADMIN_PASSWORD:
    pytest.skip("ADMIN_PASSWORD env var not set — regression tests need admin creds", allow_module_level=True)

TS = int(time.time() * 1000)
# Include xdist worker id so each parallel worker registers its own unique email
_WORKER = os.environ.get("PYTEST_XDIST_WORKER", "solo")
TEST_EMAIL = f"testuser_{TS}_{_WORKER}@example.com"
TEST_PASSWORD = os.environ.get("TEST_USER_PASSWORD", "test1234")
TEST_NAME = "TEST User Regression"


@pytest.fixture(scope="module")
def user_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/register", json={
        "email": TEST_EMAIL, "password": TEST_PASSWORD, "name": TEST_NAME
    })
    if r.status_code == 400:
        # already exists - login instead
        r = s.post(f"{API}/auth/login", json={"email": TEST_EMAIL, "password": TEST_PASSWORD})
    assert r.status_code == 200, f"user_session setup failed: {r.status_code} {r.text}"
    return s


@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return s


# ---------- Auth ----------
class TestAuth:
    def test_register_new_user(self, user_session):
        # user_session fixture already registered/logged in, verify state
        r = user_session.get(f"{API}/auth/me")
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["user"]["email"] == TEST_EMAIL
        assert data["user"]["role"] == "user"
        assert "id" in data["user"]
        assert "access_token" in user_session.cookies.get_dict()

    def test_register_duplicate(self, user_session):
        s = requests.Session()
        r = s.post(f"{API}/auth/register", json={
            "email": TEST_EMAIL, "password": TEST_PASSWORD, "name": TEST_NAME
        })
        assert r.status_code == 400

    def test_login_wrong_password(self):
        s = requests.Session()
        r = s.post(f"{API}/auth/login", json={"email": TEST_EMAIL, "password": "wrongpass"})
        assert r.status_code == 401
        assert "salah" in r.json().get("detail", "").lower()

    def test_me_with_cookie(self, user_session):
        r = user_session.get(f"{API}/auth/me")
        assert r.status_code == 200
        assert r.json()["user"]["email"] == TEST_EMAIL

    def test_me_no_cookie(self):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_admin_login(self, admin_session):
        r = admin_session.get(f"{API}/auth/me")
        assert r.status_code == 200
        assert r.json()["user"]["role"] == "admin"

    def test_logout_clears_cookies(self):
        """Kept in TestAuth so xdist loadscope pins it to the same worker as user_session fixture."""
        s = requests.Session()
        r = s.post(f"{API}/auth/login", json={"email": TEST_EMAIL, "password": TEST_PASSWORD})
        assert r.status_code == 200
        assert s.get(f"{API}/auth/me").status_code == 200
        r2 = s.post(f"{API}/auth/logout")
        assert r2.status_code == 200
        s.cookies.clear()
        r3 = s.get(f"{API}/auth/me")
        assert r3.status_code == 401


# ---------- Tracking ----------
class TestTracking:
    def test_mark_watched(self, user_session):
        r = user_session.post(f"{API}/tracking/mark", json={
            "video_id": "v1", "video_title": "CV Basics", "watched": True
        })
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["success"] is True
        assert "v1" in data["watched_videos"]
        assert data["watched_count"] >= 1
        assert data["total"] == 7
        assert data["progress_percent"] == int((data["watched_count"] / 7) * 100)

    def test_mark_second_video(self, user_session):
        r = user_session.post(f"{API}/tracking/mark", json={
            "video_id": "v2", "video_title": "CV Format", "watched": True
        })
        assert r.status_code == 200
        assert "v2" in r.json()["watched_videos"]

    def test_get_my_progress(self, user_session):
        r = user_session.get(f"{API}/tracking/me")
        assert r.status_code == 200
        data = r.json()
        assert data["watched_count"] >= 2
        assert "v1" in data["watched_videos"]

    def test_unmark_video(self, user_session):
        r = user_session.post(f"{API}/tracking/mark", json={
            "video_id": "v1", "watched": False
        })
        assert r.status_code == 200
        assert "v1" not in r.json()["watched_videos"]

    def test_tracking_requires_auth(self):
        r = requests.post(f"{API}/tracking/mark", json={"video_id": "v1", "watched": True})
        assert r.status_code == 401


# ---------- Admin ----------
class TestAdmin:
    def test_admin_users_list(self, admin_session):
        r = admin_session.get(f"{API}/admin/users")
        assert r.status_code == 200, r.text
        data = r.json()
        assert "users" in data
        assert data["total_videos"] == 7
        emails = [u["email"] for u in data["users"]]
        assert TEST_EMAIL in emails, f"Newly registered user not found in admin list. Emails: {emails}"
        # Verify test user progress exists
        test_user = next(u for u in data["users"] if u["email"] == TEST_EMAIL)
        assert "v2" in test_user["watched_videos"]
        assert test_user["progress_percent"] >= 0

    def test_admin_users_non_admin_forbidden(self, user_session):
        r = user_session.get(f"{API}/admin/users")
        assert r.status_code == 403

    def test_admin_users_anonymous(self):
        r = requests.get(f"{API}/admin/users")
        assert r.status_code == 401


# ---------- Templates ----------
class TestTemplates:
    def test_templates_list(self):
        r = requests.get(f"{API}/templates/list")
        assert r.status_code == 200, r.text

    def test_download_cv_bundle(self):
        r = requests.get(f"{API}/templates/download/cv-bundle")
        assert r.status_code == 200
        assert len(r.content) > 100

    def test_download_cover_letter_bundle(self):
        r = requests.get(f"{API}/templates/download/cover-letter-bundle")
        assert r.status_code == 200
        assert len(r.content) > 100


# ---------- SEC-001 CORS ----------
# NOTE: Public preview URL is fronted by Cloudflare which handles OPTIONS with ACAO:*
# and NO Access-Control-Allow-Credentials header — browsers reject that combo for
# credentialed requests, so it is safe. To test the actual FastAPI CORS regex
# middleware (SEC-001 fix), we hit the direct backend on localhost:8001.
DIRECT_API = "http://localhost:8001/api"


class TestCORS:
    def test_cors_foreign_origin_rejected_direct(self):
        """FastAPI CORS regex: evil origin must NOT be echoed."""
        r = requests.options(f"{DIRECT_API}/auth/me", headers={
            "Origin": "https://evil.example.com",
            "Access-Control-Request-Method": "GET",
        })
        acao = r.headers.get("access-control-allow-origin", "")
        assert acao != "https://evil.example.com", (
            f"CORS regression: evil origin echoed! ACAO={acao!r}"
        )
        assert acao != "*", "Wildcard ACAO must not appear with credentials"
        assert acao == "", f"Expected empty ACAO for rejected origin, got {acao!r}"

    def test_cors_valid_emergent_origin_allowed_direct(self):
        r = requests.options(f"{DIRECT_API}/auth/me", headers={
            "Origin": "https://career-boost-410.preview.emergentagent.com",
            "Access-Control-Request-Method": "GET",
        })
        acao = r.headers.get("access-control-allow-origin", "")
        acac = r.headers.get("access-control-allow-credentials", "")
        assert acao == "https://career-boost-410.preview.emergentagent.com"
        assert acac.lower() == "true"

    def test_cors_localhost_allowed_direct(self):
        r = requests.options(f"{DIRECT_API}/auth/me", headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        })
        acao = r.headers.get("access-control-allow-origin", "")
        assert acao == "http://localhost:3000", f"Localhost should be allowed, got {acao!r}"

    def test_public_url_preflight_no_credentials_leak(self):
        """Ingress-fronted preflight returns ACAO:* but must NOT set ACAC:true."""
        r = requests.options(f"{API}/auth/me", headers={
            "Origin": "https://evil.example.com",
            "Access-Control-Request-Method": "GET",
        })
        acac = r.headers.get("access-control-allow-credentials", "")
        assert acac.lower() != "true", (
            "SECURITY: public URL preflight echoes ACAC:true with * ACAO — browser would allow evil origin!"
        )


# ---------- SEC-002 HTML Escape ----------
class TestHtmlEscape:
    def test_login_email_escapes_html(self):
        from email_service import build_login_email_html
        html = build_login_email_html(
            user_name='<img src=x onerror=alert(1)>Attacker',
            user_email='<b>bold</b>@evil.com',
            watched_count=0, total=7,
        )
        assert "<img src=x" not in html, "raw <img> tag leaked into email HTML"
        # onerror= substring survives as inert text (between escaped < >) — that's fine.
        # What matters is the raw < and > are gone so browser cannot parse a tag.
        assert "&lt;img src=x onerror=alert(1)&gt;Attacker" in html
        assert "&lt;b&gt;bold&lt;/b&gt;@evil.com" in html

    def test_progress_email_escapes_html(self):
        from email_service import build_progress_email_html
        html = build_progress_email_html(
            user_name='<script>alert(1)</script>',
            user_email='a@b.com',
            video_title='<a href="http://evil">click</a>',
            watched_count=1, total=7,
        )
        assert "<script>" not in html
        assert "&lt;script&gt;alert(1)&lt;/script&gt;" in html
        assert '<a href="http://evil">' not in html
        assert "&lt;a href=" in html

    def test_register_with_html_in_name_stores_safely(self):
        """End-to-end: register with HTML in name, ensure email builder escapes it."""
        from email_service import build_login_email_html
        ts = int(time.time() * 1000)
        email = f"xsstest_{ts}@example.com"
        payload_name = '<img src=x onerror=alert(1)>Attacker'
        s = requests.Session()
        r = s.post(f"{API}/auth/register", json={
            "email": email, "password": "test1234", "name": payload_name,
        })
        assert r.status_code == 200, r.text
        # Verify /me returns the raw name (stored as-is) — display-side escaping is builder's job
        me = s.get(f"{API}/auth/me").json()
        assert me["user"]["name"] == payload_name
        # Now simulate what login-email builder would produce
        html = build_login_email_html(payload_name, email, 0, 7)
        assert "<img src=x" not in html
        # Cleanup
        try:
            from motor.motor_asyncio import AsyncIOMotorClient
            import asyncio
            async def _c():
                c = AsyncIOMotorClient(os.environ["MONGO_URL"])
                await c[os.environ["DB_NAME"]].users.delete_one({"email": email})
                c.close()
            asyncio.run(_c())
        except Exception:
            pass



# ---------- Cleanup ----------
@pytest.fixture(scope="module", autouse=True)
def cleanup_test_user():
    yield
    # Best-effort cleanup via direct MongoDB
    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        import asyncio
        async def _clean():
            client = AsyncIOMotorClient(os.environ["MONGO_URL"])
            db = client[os.environ["DB_NAME"]]
            await db.users.delete_one({"email": TEST_EMAIL})
            client.close()
        asyncio.run(_clean())
    except Exception as e:
        print(f"Cleanup skipped: {e}")
