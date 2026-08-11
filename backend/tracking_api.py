"""Tracking routes: mark/unmark watched, get my progress, admin dashboard."""
import asyncio
import logging
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field

from auth_utils import get_current_user, require_admin
from email_service import send_admin_notification, build_progress_email_html

logger = logging.getLogger(__name__)

tracking_router = APIRouter(prefix="/tracking")
admin_router = APIRouter(prefix="/admin")

TOTAL_VIDEOS = 7


class MarkInput(BaseModel):
    video_id: str = Field(min_length=1, max_length=40)
    video_title: str = Field(default="", max_length=200)
    watched: bool = True


@tracking_router.post("/mark")
async def mark_video(payload: MarkInput, user=Depends(get_current_user)):
    from database import db
    uid = ObjectId(user["id"])
    if payload.watched:
        await db.users.update_one(
            {"_id": uid},
            {"$addToSet": {"watched_videos": payload.video_id}},
        )
    else:
        await db.users.update_one(
            {"_id": uid},
            {"$pull": {"watched_videos": payload.video_id}},
        )

    updated = await db.users.find_one({"_id": uid})
    watched = updated.get("watched_videos", []) or []

    if payload.watched:
        html = build_progress_email_html(
            user_name=updated.get("name", ""),
            user_email=updated.get("email", ""),
            video_title=payload.video_title or payload.video_id,
            watched_count=len(watched),
            total=TOTAL_VIDEOS,
        )
        asyncio.create_task(
            send_admin_notification(
                subject=f"✅ Progres: {updated.get('name','')} nonton video ({len(watched)}/{TOTAL_VIDEOS})",
                html=html,
            )
        )

    return {
        "success": True,
        "watched_videos": watched,
        "watched_count": len(watched),
        "total": TOTAL_VIDEOS,
        "progress_percent": int((len(watched) / TOTAL_VIDEOS) * 100),
    }


@tracking_router.get("/me")
async def my_progress(user=Depends(get_current_user)):
    watched = user.get("watched_videos", []) or []
    return {
        "watched_videos": watched,
        "watched_count": len(watched),
        "total": TOTAL_VIDEOS,
        "progress_percent": int((len(watched) / TOTAL_VIDEOS) * 100),
    }


@admin_router.get("/users")
async def list_users(_admin=Depends(require_admin)):
    from database import db
    cursor = db.users.find({}, {"password_hash": 0}).sort("last_login", -1)
    users = await cursor.to_list(500)
    result = []
    for u in users:
        watched = u.get("watched_videos", []) or []
        result.append({
            "id": str(u["_id"]),
            "email": u.get("email", ""),
            "name": u.get("name", ""),
            "role": u.get("role", "user"),
            "watched_videos": watched,
            "watched_count": len(watched),
            "total": TOTAL_VIDEOS,
            "progress_percent": int((len(watched) / TOTAL_VIDEOS) * 100),
            "created_at": u.get("created_at"),
            "last_login": u.get("last_login"),
        })
    return {
        "total_users": len(result),
        "total_videos": TOTAL_VIDEOS,
        "users": result,
    }
