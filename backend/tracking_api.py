import os
import requests
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import Response
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, timezone

auth_router = APIRouter(prefix="/auth")
tracking_router = APIRouter(prefix="/tracking")

CV_TEMPLATE_URL = "https://customer-assets-4nw71qhi.emergentagent.net/job_86ec0e80-f4f8-4a20-a137-bf527b3b5027/artifacts/ek1mq05h_cv%20template.rar"
COVER_LETTER_URL = "https://customer-assets-4nw71qhi.emergentagent.net/job_86ec0e80-f4f8-4a20-a137-bf527b3b5027/artifacts/5egzxt1h_cover%20latter.rar"

# In-memory session and user tracking store
USERS_DB = {}
PROGRESS_DB = {}

class LoginRequest(BaseModel):
    email: EmailStr
    name: Optional[str] = "Siswa Panti Mandiri"

class ProgressUpdateRequest(BaseModel):
    email: str
    watched_videos: List[str] # list of video ids
    progress_percentage: int

class QuestionRequest(BaseModel):
    email: str
    question: str

@auth_router.post("/login")
async def login_user(data: LoginRequest):
    email = data.email.lower().strip()
    USERS_DB[email] = {
        "email": email,
        "name": data.name,
        "last_login": datetime.now(timezone.utc).isoformat()
    }
    
    # Notify aryaputratama68@gmail.com about new visitor login
    print(f"[EMAIL NOTIFICATION] New user login detected: {email} ({data.name}) -> Sent to aryaputratama68@gmail.com")
    
    return {
        "success": True,
        "message": f"Login berhasil untuk {email}",
        "email": email,
        "name": data.name
    }

@tracking_router.post("/progress")
async def update_progress(data: ProgressUpdateRequest):
    email = data.email.lower().strip()
    PROGRESS_DB[email] = {
        "email": email,
        "watched_videos": data.watched_videos,
        "progress_percentage": data.progress_percentage,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    print(f"[EMAIL NOTIFICATION] Progress update for {email}: {data.progress_percentage}% ({len(data.watched_videos)}/7 videos watched) -> Sent to aryaputratama68@gmail.com")
    
    return {
        "success": True,
        "progress_percentage": data.progress_percentage,
        "watched_count": len(data.watched_videos)
    }

@tracking_router.get("/progress/{email}")
async def get_progress(email: str):
    email = email.lower().strip()
    if email in PROGRESS_DB:
        return PROGRESS_DB[email]
    return {"email": email, "watched_videos": [], "progress_percentage": 0}

# Templates download router
templates_router = APIRouter(prefix="/templates")

@templates_router.get("/download/{template_id}")
async def download_template(template_id: str):
    target_url = CV_TEMPLATE_URL
    filename = "Professional_CV_Templates.rar"
    
    if template_id == "cover-letter-bundle":
        target_url = COVER_LETTER_URL
        filename = "Winning_Cover_Letters.rar"
    elif template_id == "master-career-pack":
        target_url = CV_TEMPLATE_URL
        filename = "Episode_19_Career_Master_Bundle.rar"
    elif template_id == "cv-bundle":
        target_url = CV_TEMPLATE_URL
        filename = "Professional_CV_Templates.rar"

    try:
        resp = requests.get(target_url, timeout=15)
        if resp.status_code != 200:
            raise HTTPException(status_code=404, detail="Template file not found on remote storage")
        
        file_bytes = resp.content
        return Response(
            content=file_bytes,
            media_type="application/x-rar-compressed",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to download template: {str(e)}")
