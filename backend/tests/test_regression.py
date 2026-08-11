"""Regression tests after database.py refactor.
Covers auth, tracking, admin, and templates endpoints.
"""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://career-boost-410.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "aryaputratama68@gmail.com"
ADMIN_PASSWORD = "Quincy2108"

TS = int(time.time())
TEST_EMAIL = f"testuser_{TS}@example.com"
TEST_PASSWORD = "test1234"
TEST_NAME = "TEST User Regression"


@pytest.fixture(scope="module")
def user_session():
    s = requests.Session()
    # Ensure user exists and session is logged in (works across xdist workers)
    r = s.post(f"{API}/auth/register", json={
        "email": TEST_EMAIL, "password": TEST_PASSWORD, "name": TEST_NAME
    })
    if r.status_code == 400:
        # already exists - login instead
        s.post(f"{API}/auth/login", json={"email": TEST_EMAIL, "password": TEST_PASSWORD})
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


# ---------- Logout ----------
class TestLogout:
    def test_logout_clears_cookies(self):
        s = requests.Session()
        r = s.post(f"{API}/auth/login", json={"email": TEST_EMAIL, "password": TEST_PASSWORD})
        assert r.status_code == 200
        # Verify me works
        assert s.get(f"{API}/auth/me").status_code == 200
        # Logout
        r2 = s.post(f"{API}/auth/logout")
        assert r2.status_code == 200
        # Clear cookies manually since delete_cookie sends expires
        s.cookies.clear()
        r3 = s.get(f"{API}/auth/me")
        assert r3.status_code == 401


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
