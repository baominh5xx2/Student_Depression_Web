from replit import db as replit_db
import logging
import os
import json
from datetime import datetime
import uuid

# Cấu hình logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ReplitDB:
    initialized = False

    @classmethod
    async def init(cls):
        cls.initialized = True
        if 'predictions' not in replit_db.keys():
            replit_db['predictions'] = json.dumps([])
        logger.info("Đã khởi tạo Replit DB")

    @classmethod
    async def close(cls):
        # No explicit close needed for Replit DB
        logger.info("Đã đóng kết nối Replit DB")