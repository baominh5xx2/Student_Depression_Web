from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from joblib import load
import numpy as np
import os
import pandas as pd
from typing import Dict, Union, Any

router = APIRouter(prefix="/api")

MODEL_PATH = "app/models/depression_model.joblib"
FEATURE_PATH = "app/models/feature_names.joblib"

# Kiểm tra sự tồn tại của model và feature file
if not os.path.exists(MODEL_PATH) or not os.path.exists(FEATURE_PATH):
    raise RuntimeError("Model or feature file not found. Please train the model first.")

# Load model và feature names
model = load(MODEL_PATH)
feature_data = load(FEATURE_PATH)
feature_names = feature_data['feature_names']

# Class cho dạng input tiêu chuẩn (non one-hot)
class Features(BaseModel):
    Age: float
    Academic_Pressure: float
    Work_Pressure: float
    CGPA: float
    Study_Satisfaction: float
    Job_Satisfaction: float
    Sleep_Duration: float
    Suicidal_Thoughts: int
    Work_Study_Hours: float
    Financial_Stress: float
    Family_History_of_Mental_Illness: int
    Gender: str
    Profession: str
    Dietary_Habits: str
    Degree: str

# Helper function to build DataFrame in the correct column order
def make_input_row(features_dict):
    """
    Tạo một DataFrame với một dòng chứa dữ liệu input, đảm bảo đúng thứ tự feature
    và giá trị mặc định là 0 cho các feature bị thiếu.
    """
    row = {col: 0 for col in feature_names}
    for k, v in features_dict.items():
        if k in row:
            row[k] = v
    return pd.DataFrame([row], columns=feature_names)

@router.post("/predict")
def predict(features: Dict[str, Any]):
    """
    API endpoint cho dự đoán trầm cảm.
    Nhận đầu vào dưới dạng dictionary với các trường đã được one-hot encode sẵn.
    """
    try:
        # Dữ liệu được gửi trực tiếp ở định dạng one-hot
        # Chuyển đổi Academic_Pressure -> Academic Pressure, Work_Study_Hours -> Work/Study Hours, ...
        mapped_input = {}
        
        # Mapping các trường chính
        field_mappings = {
            'Age': 'Age',
            'Academic_Pressure': 'Academic Pressure',
            'Work_Pressure': 'Work Pressure',
            'CGPA': 'CGPA',
            'Study_Satisfaction': 'Study Satisfaction',
            'Job_Satisfaction': 'Job Satisfaction',
            'Sleep_Duration': 'Sleep Duration',
            'Suicidal_Thoughts': 'Suicidal_Thoughts',
            'Work_Study_Hours': 'Work/Study Hours',
            'Financial_Stress': 'Financial Stress',
            'Family_History_of_Mental_Illness': 'Family History of Mental Illness'
        }
        
        # Áp dụng mapping và thêm vào mapped_input
        for client_field, model_field in field_mappings.items():
            if client_field in features:
                mapped_input[model_field] = features[client_field]
        
        # Thêm các trường one-hot trực tiếp vào mapped_input
        # Các trường bắt đầu bằng Gender_, Profession_, Dietary_Habits_, Degree_
        for field, value in features.items():
            prefix_mappings = {
                'Gender_': 'Gender_',
                'Profession_': 'Profession_',
                'Dietary_Habits_': 'Dietary Habits_',
                'Degree_': 'Degree_'
            }
            
            for prefix, mapped_prefix in prefix_mappings.items():
                if field.startswith(prefix):
                    # Lấy phần sau prefix, ví dụ 'Gender_Male' -> 'Male'
                    suffix = field[len(prefix):]
                    # Tạo tên trường đúng định dạng, ví dụ 'Gender_' + 'Male' -> 'Gender_Male'
                    model_field = f"{mapped_prefix}{suffix}"
                    mapped_input[model_field] = value

        # Tạo input DataFrame đúng định dạng cho model
        input_df = make_input_row(mapped_input)
        
        # Debug input data
        print(f"Input features: {features}")
        print(f"Mapped input: {mapped_input}")
        
        # Dự đoán
        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0].tolist()
        
        # Log kết quả dự đoán
        print(f"Prediction: {prediction}, Probabilities: {probability}")
        
        return {
            "prediction": int(prediction),
            "probability": probability,
            "message": "Depression risk detected" if prediction == 1 else "No depression risk detected"
        }
    except Exception as e:
        # Log lỗi cho debug
        print(f"Error in prediction: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")