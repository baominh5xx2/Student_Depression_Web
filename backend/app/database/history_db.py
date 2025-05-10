from datetime import datetime
from typing import Dict, List
import json
import uuid
import os

# Check if running on Replit
ON_REPLIT = os.getenv("REPL_ID") is not None

if ON_REPLIT:
    from replit import db as replit_db
else:
    # Fallback to a simple file-based storage for non-replit environments
    import shelve
    import tempfile
    
    class DummyDB:
        def __init__(self):
            self.db_path = os.path.join(tempfile.gettempdir(), "prediction_history")
            
        def __getitem__(self, key):
            with shelve.open(self.db_path) as db:
                return db.get(key, "[]")
                
        def __setitem__(self, key, value):
            with shelve.open(self.db_path) as db:
                db[key] = value
                
        def keys(self):
            with shelve.open(self.db_path) as db:
                return list(db.keys())
    
    replit_db = DummyDB()

class HistoryDB:
    initialized = False

    @classmethod
    def init(cls, client=None):  # client parameter kept for compatibility
        if 'predictions' not in replit_db.keys():
            replit_db['predictions'] = json.dumps([])
        cls.initialized = True

    @classmethod
    async def save_prediction(cls, input_data: Dict, prediction: int, probabilities: List[float], user_name: str = None):
        history_entry = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "input_data": input_data,
            "prediction": prediction,
            "probabilities": probabilities,
            "user_name": user_name
        }
        
        # Get current predictions
        predictions = json.loads(replit_db['predictions'])
        # Add new prediction
        predictions.append(history_entry)
        # Save back to DB
        replit_db['predictions'] = json.dumps(predictions)

    @classmethod
    async def get_history(cls, limit: int = 10):
        predictions = json.loads(replit_db['predictions'])
        # Sort by timestamp in descending order
        predictions.sort(key=lambda x: x["timestamp"], reverse=True)
        # Limit results
        return predictions[:limit]