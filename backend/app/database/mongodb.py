# This file is kept for compatibility but is no longer used.
# The application has been migrated to use Replit DB instead of MongoDB.

import logging

# Cấu hình logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class MongoDB:
    """
    This class is deprecated. 
    The application now uses Replit DB through the history_db.py module.
    """
    client = None
    db = None

    @classmethod
    async def init(cls):
        logger.info("MongoDB has been replaced with Replit DB")
        pass

    @classmethod
    async def close(cls):
        logger.info("MongoDB has been replaced with Replit DB")
        pass
