from fastapi import APIRouter, HTTPException
from typing import Dict, List
from pydantic import BaseModel
from app.database.history_db import HistoryDB

class PredictionHistory(BaseModel):
    input_data: Dict
    prediction: int
    probabilities: List[float]
    user_name: str = None

router = APIRouter(
    prefix="/history",
    tags=["history"]
)

@router.post("/save")
async def save_prediction(history_data: PredictionHistory):
    try:
        await HistoryDB.save_prediction(
            history_data.input_data,
            history_data.prediction,
            history_data.probabilities,
            history_data.user_name
        )
        return {"message": "Prediction saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/list")
async def get_history(limit: int = 10):
    try:
        history = await HistoryDB.get_history(limit)
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))