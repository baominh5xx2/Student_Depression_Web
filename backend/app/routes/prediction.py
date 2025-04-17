from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np
from app.models.model import Model

router = APIRouter(prefix="/api/predictions", tags=["predictions"])

# Singleton model instance
model_instance = Model()

class PredictionRequest(BaseModel):
    features: List[List[float]]

class PredictionResponse(BaseModel):
    predictions: List[float]

@router.post("/", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Make predictions using the trained model
    """
    try:
        features = np.array(request.features)
        predictions = model_instance.predict(features)
        return PredictionResponse(predictions=predictions.tolist())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@router.post("/train")
async def train_model(X: List[List[float]], y: List[float]):
    """
    Train the model with new data
    """
    try:
        X_array = np.array(X)
        y_array = np.array(y)
        model_instance.train(X_array, y_array)
        return {"message": "Model trained successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training error: {str(e)}") 