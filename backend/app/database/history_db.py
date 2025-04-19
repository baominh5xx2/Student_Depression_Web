from datetime import datetime
from typing import Dict, List
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId, json_util
import json

class HistoryDB:
    client = None
    db = None

    @classmethod
    def init(cls, client: AsyncIOMotorClient):
        cls.client = client
        cls.db = client.prediction_history

    @classmethod
    async def save_prediction(cls, input_data: Dict, prediction: int, probabilities: List[float], user_name: str = None):
        history_entry = {
            "timestamp": datetime.utcnow(),
            "input_data": input_data,
            "prediction": prediction,
            "probabilities": probabilities,
            "user_name": user_name
        }
        await cls.db.predictions.insert_one(history_entry)

    @classmethod
    async def get_history(cls, limit: int = 10):
        cursor = cls.db.predictions.find().sort("timestamp", -1).limit(limit)
        history = await cursor.to_list(length=limit)
        # Convert ObjectId to string
        return json.loads(json_util.dumps(history))