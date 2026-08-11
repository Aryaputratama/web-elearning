from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
from datetime import datetime, timezone
from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid

from database import client, db

app = FastAPI()
api_router = APIRouter(prefix="/api")


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# Include feature routers
from templates_api import templates_router
from auth_routes import auth_router
from tracking_api import tracking_router, admin_router

api_router.include_router(templates_router)
api_router.include_router(auth_router)
api_router.include_router(tracking_router)
api_router.include_router(admin_router)

app.include_router(api_router)

# CORS: allow same-origin preview host + emergentagent subdomains + localhost.
# Never reflect arbitrary origins when allow_credentials=True (security).
cors_origins = os.environ.get('CORS_ORIGINS', '*')
if cors_origins == '*':
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"^(https://[a-z0-9-]+\.(preview\.)?emergentagent\.com|http://localhost:\d+|http://127\.0\.0\.1:\d+)$",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins.split(','),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_tasks():
    from auth_utils import hash_password, verify_password
    # Ensure indexes
    try:
        await db.users.create_index("email", unique=True)
    except Exception as e:
        logger.warning(f"Index creation warning: {e}")

    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "").lower().strip()
    admin_password = os.environ.get("ADMIN_PASSWORD", "")
    if admin_email and admin_password:
        existing = await db.users.find_one({"email": admin_email})
        if existing is None:
            await db.users.insert_one({
                "email": admin_email,
                "password_hash": hash_password(admin_password),
                "name": "HCG Teams Admin",
                "role": "admin",
                "watched_videos": [],
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
            logger.info(f"Seeded admin: {admin_email}")
        else:
            # Ensure admin role + password sync
            updates = {}
            if existing.get("role") != "admin":
                updates["role"] = "admin"
            if not verify_password(admin_password, existing.get("password_hash", "")):
                updates["password_hash"] = hash_password(admin_password)
            if updates:
                await db.users.update_one({"_id": existing["_id"]}, {"$set": updates})
                logger.info(f"Admin synced: {admin_email}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
