from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from joblib import load, dump
import numpy as np
import os
import pandas as pd
from typing import Dict, Union, Any
from .model import LinearSVM_Dual

# Define paths relative to current directory
current_dir = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(current_dir, "svm_scratch_model.joblib")
FEATURE_PATH = os.path.join(os.path.dirname(current_dir), "svm_lib/feature_names.joblib")
SCALER_PATH = os.path.join(os.path.dirname(current_dir), "dataset/depression_scaler.joblib")

router = APIRouter(prefix="/api")

# Check if feature file and scaler exist
if not os.path.exists(FEATURE_PATH):
    raise RuntimeError(f"Feature file not found at {FEATURE_PATH}.")

# Check if scaler exists
if not os.path.exists(SCALER_PATH):
    alternative_path = "../dataset/depression_scaler.joblib"
    if os.path.exists(alternative_path):
        SCALER_PATH = alternative_path
    else:
        raise RuntimeError(f"Scaler not found at {SCALER_PATH} or {alternative_path}. Please run preprocessing first.")

# Initialize model or load if exists
if os.path.exists(MODEL_PATH):
    try:
        model = load(MODEL_PATH)
        print(f"Loaded SVM Scratch model from {MODEL_PATH}")
    except Exception as e:
        print(f"Error loading model: {e}. Will train a new one.")
        model = None
else:
    model = None

# Load feature names
feature_data = load(FEATURE_PATH)
feature_names = feature_data['feature_names']
scaler = load(SCALER_PATH)

# Load feature data for scaling information
dataset_feature_data = load(os.path.join(os.path.dirname(current_dir), "dataset/feature_names.joblib"))
columns_to_scale = dataset_feature_data['columns_to_scale']

# Helper function to build DataFrame in the correct column order
def make_input_row(features_dict):
    """
    Create a DataFrame with one row containing input data, ensuring correct feature order
    and default values of 0 for missing features.
    """
    row = {col: 0 for col in feature_names}
    for k, v in features_dict.items():
        if k in row:
            row[k] = v
    return pd.DataFrame([row], columns=feature_names)

def train_model_if_needed():
    """Train the SVM model from scratch if not already loaded"""
    global model
    if model is None:
        print("Training SVM model from scratch...")
        try:
            # Load training data
            dataset_path = os.path.join(os.path.dirname(current_dir), "dataset/train_set_encoded.csv")
            
            if not os.path.exists(dataset_path):
                raise FileNotFoundError(f"Training data not found at {dataset_path}")
                
            data = pd.read_csv(dataset_path)
            data = data.head(3000)
            
            # Split features and target
            X = data.drop('Depression', axis=1).values
            y = data['Depression'].values
            
            # Initialize and train model
            model = LinearSVM_Dual(C=1.0, tol=1e-3, max_iter=1000)
            model.fit(X, y)
            
            # Save model
            dump(model, MODEL_PATH)
            print(f"SVM Scratch model trained and saved to {MODEL_PATH}")
        except Exception as e:
            print(f"Error training model: {e}")
            raise RuntimeError(f"Failed to train SVM model: {e}")

# Train model if needed
train_model_if_needed()

@router.post("/predict/svm_scratch")
def predict(features: Dict[str, Any]):
    """
    API endpoint for depression prediction using SVM from scratch.
    Accepts input as a dictionary with fields already one-hot encoded.
    """
    try:
        # Data is sent directly in one-hot format
        # Convert Academic_Pressure -> Academic Pressure, Work_Study_Hours -> Work/Study Hours, etc.
        mapped_input = {}
        
        # Map main fields
        field_mappings = {
            'Age': 'Age',
            'Academic_Pressure': 'Academic Pressure',
            'Work_Pressure': 'Work Pressure',
            'CGPA': 'CGPA',
            'Study_Satisfaction': 'Study Satisfaction',
            'Job_Satisfaction': 'Job Satisfaction',
            'Sleep_Duration': 'Sleep Duration',
            'Suicidal_Thoughts': 'Have you ever had suicidal thoughts ?_Yes',
            'Work_Study_Hours': 'Work/Study Hours',
            'Financial_Stress': 'Financial Stress',
            'Family_History_of_Mental_Illness': 'Family History of Mental Illness_Yes'
        }
        
        # Apply mapping and add to mapped_input
        for client_field, model_field in field_mappings.items():
            if client_field in features:
                mapped_input[model_field] = features[client_field]
        
        # Add one-hot fields directly to mapped_input
        # Fields starting with Gender_, Profession_, Dietary_Habits_, Degree_
        for field, value in features.items():
            prefix_mappings = {
                'Gender_': 'Gender_',
                'Profession_': 'Profession_',
                'Dietary_Habits_': 'Dietary Habits_',
                'Degree_': 'Degree_'
            }
            
            for prefix, mapped_prefix in prefix_mappings.items():
                if field.startswith(prefix):
                    # Get part after prefix, e.g., 'Gender_Male' -> 'Male'
                    suffix = field[len(prefix):]
                    # Create field name in correct format, e.g., 'Gender_' + 'Male' -> 'Gender_Male'
                    model_field = f"{mapped_prefix}{suffix}"
                    mapped_input[model_field] = value

        # Create input DataFrame in correct format for model
        input_df = make_input_row(mapped_input)
        
        # Scale numerical features
        input_df[columns_to_scale] = scaler.transform(input_df[columns_to_scale])
        
        # Debug input data
        print(f"Input features: {features}")
        print(f"Mapped input: {mapped_input}")
        print(f"Scaled input: {input_df[columns_to_scale].values}")
        
        # Convert to numpy array for prediction
        X = input_df.values
        
        # Predict
        prediction = model.predict(X)[0]
        
        # Our scratch model doesn't provide probabilities directly
        # So we approximate based on distance from decision boundary
        decision_value = float(model.project(X)[0])
        
        # Simple sigmoid to convert decision value to probability-like score
        import math
        def sigmoid(x):
            return 1 / (1 + math.exp(-x))
        
        probability_score = sigmoid(decision_value)
        probability = [1 - probability_score, probability_score]
        
        # Log prediction results
        print(f"Prediction: {prediction}, Probabilities: {probability}")
        
        return {
            "prediction": int(prediction),
            "probability": probability,
            "message": "Depression risk detected" if prediction == 1 else "No depression risk detected",
            "model": "SVM Linear Scratch Implementation"
        }
    except Exception as e:
        # Log error for debugging
        print(f"Error in prediction: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")
