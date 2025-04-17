from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from joblib import load
import numpy as np
import os

router = APIRouter(prefix="/api")

MODEL_PATH = "app/models/depression_model.joblib"
FEATURE_PATH = "app/models/feature_names.joblib"

if not os.path.exists(MODEL_PATH) or not os.path.exists(FEATURE_PATH):
    raise RuntimeError("Model or feature file not found. Please train the model first.")

model = load(MODEL_PATH)
feature_data = load(FEATURE_PATH)
feature_names = feature_data['feature_names']

# Các giá trị có thể có của từng biến phân loại (lấy từ lúc train model)
GENDER_VALUES = ['Male', 'Female']  # ví dụ, nếu có nhiều giá trị hơn thì bổ sung
PROFESSION_VALUES = ['Student', 'Architect', 'Teacher', 'Digital Marketer', 'Content Writer']     # bổ sung nếu có nhiều nghề
DIETARY_VALUES = ['Healthy', 'Moderate', 'Unhealthy',"Others"]
DEGREE_VALUES = ['B.Com', 'B.Arch', 'BCA', 'Class 12', 'B.Ed']  # bổ sung đủ

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

@router.post("/predict")
def predict(features: Features):
    try:
        input_dict = features.dict()
        # Đổi key cho đúng tên cột one-hot
        input_dict['Dietary Habits'] = input_dict.pop('Dietary_Habits')

        # One-hot encoding cho các biến phân loại
        one_hot = {}
        # Gender
        for val in GENDER_VALUES[1:]:  # drop_first=True khi train
            one_hot[f'Gender_{val}'] = 1 if input_dict['Gender'] == val else 0
        # Profession
        for val in PROFESSION_VALUES[1:]:
            one_hot[f'Profession_{val}'] = 1 if input_dict['Profession'] == val else 0
        # Dietary Habits
        for val in DIETARY_VALUES[1:]:
            one_hot[f'Dietary Habits_{val}'] = 1 if input_dict['Dietary Habits'] == val else 0
        # Degree
        for val in DEGREE_VALUES[1:]:
            one_hot[f'Degree_{val}'] = 1 if input_dict['Degree'] == val else 0

        # Tạo input_data đúng thứ tự feature_names
        input_data = []
        for name in feature_names:
            if name in input_dict:
                input_data.append(input_dict[name])
            elif name in one_hot:
                input_data.append(one_hot[name])
            else:
                input_data.append(0)  # default nếu thiếu

        input_array = np.array([input_data])
        prediction = model.predict(input_array)[0]
        probability = model.predict_proba(input_array)[0].tolist()
        return {
            "prediction": int(prediction),
            "probability": probability
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))