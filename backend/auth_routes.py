"""Auth routes: register, login, logout, me."""
import asyncio
import logging
from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Request, Response, Depends
from pydantic import BaseModel, EmailStr, Field

from auth_utils import (
    hash_password, verify_password,
    create_access_token, create_refresh_token,
    set_auth_cookies, clear_auth_cookies,
    get_current_user,
)
from email_service import send_admin_notification, build_login_email_html

logger = logging.getLogger(__name__)

auth_router = APIRouter(prefix="/auth")

TOTAL_VIDEOS = 7  # 5 CV + 2 interview


class RegisterInput(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    name: str = Field(min_length=1, max_length=80)


class LoginInput(BaseModel):
    email: EmailStr
    password: str


def _user_to_public(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name", ""),
        "role": user.get("role", "user"),
        "watched_videos": user.get("watched_videos", []),
    }


async def _notify_login(user: dict):
    watched = user.get("watched_videos", []) or []
    html = build_login_email_html(
        user_name=user.get("name", ""),
        user_email=user.get("email", ""),
        watched_count=len(watched),
        total=TOTAL_VIDEOS,
    )
    await send_admin_notification(
        subject=f"🔔 Login: {user.get('name','')} ({user.get('email','')})",
        html=html,
    )


@auth_router.post("/register")
async def register(payload: RegisterInput, response: Response):
    from server import db
    email = payload.email.lower().strip()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar. Silakan login.")
    doc = {
        "email": email,
        "password_hash": hash_password(payload.password),
        "name": payload.name.strip(),
        "role": "user",
        "watched_videos": [],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "last_login": datetime.now(timezone.utc).isoformat(),
    }
    result = await db.users.insert_one(doc)
    doc["_id"] = result.inserted_id
    access = create_access_token(str(result.inserted_id), email)
    refresh = create_refresh_token(str(result.inserted_id))
    set_auth_cookies(response, access, refresh)
    # Fire-and-forget notification
    asyncio.create_task(_notify_login(doc))
    return {"user": _user_to_public(doc), "access_token": access}


@auth_router.post("/login")
async def login(payload: LoginInput, response: Response):
    from server import db
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Email atau password salah")
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}},
    )
    access = create_access_token(str(user["_id"]), email)
    refresh = create_refresh_token(str(user["_id"]))
    set_auth_cookies(response, access, refresh)
    asyncio.create_task(_notify_login(user))
    return {"user": _user_to_public(user), "access_token": access}


@auth_router.post("/logout")
async def logout(response: Response):
    clear_auth_cookies(response)
    return {"success": True}


@auth_router.get("/me")
async def me(user=Depends(get_current_user)):
    return {"user": _user_to_public(user)}
