import pymongo
from pymongo.database import Database
from pymongo.collection import Collection
import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Cấu hình logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()

class MongoDB:
    client = None
    db = None

    @classmethod
    async def init(cls):
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        cls.client = AsyncIOMotorClient(mongodb_url)
        cls.db = cls.client.depression_detection
        await cls.client.admin.command('ping')  # Test connection

    @classmethod
    async def close(cls):
        if cls.client:
            cls.client.close()
