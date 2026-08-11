"""Shared MongoDB client + db handle to break server<->auth circular imports."""
import os
from motor.motor_asyncio import AsyncIOMotorClient

client: AsyncIOMotorClient = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]
