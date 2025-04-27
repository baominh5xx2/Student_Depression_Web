import pandas as pd
import numpy as np
import os
from sklearn.svm import SVC
from joblib import dump

def train_svm_model():
    # Define paths relative to current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    DATASET_PATH = os.path.join(os.path.dirname(current_dir), "dataset/train_set_encoded.csv")
    MODEL_PATH = os.path.join(current_dir, "svm_model.joblib")
    FEATURE_PATH = os.path.join(current_dir, "feature_names.joblib")
    
    # Check if model already exists
    if os.path.exists(MODEL_PATH) and os.path.exists(FEATURE_PATH):
        print(f"Model already exists at {MODEL_PATH}. Skipping training.")
        return
    
    # Load dataset
    print(f"Loading dataset from {DATASET_PATH}...")
    try:
        data = pd.read_csv(DATASET_PATH)
    except FileNotFoundError:
        print(f"Dataset not found at {DATASET_PATH}, trying absolute path...")
        try:
            # Fallback to direct path
            data = pd.read_csv("../dataset/train_set_encoded.csv")
        except FileNotFoundError:
            print("Dataset not found. Please check the path.")
            return
    
    # Split features and target
    X = data.drop('Depression', axis=1)
    y = data['Depression']
    
    # Train SVM model with linear kernel and C=1
    print("Training SVM model with linear kernel and C=1...")
    model = SVC(kernel='linear', C=1, probability=True, random_state=42)
    model.fit(X, y)
    
    # Save model
    print(f"Saving model to {MODEL_PATH}...")
    dump(model, MODEL_PATH)
    
    # Save feature names
    feature_data = {
        'feature_names': X.columns.tolist(),
        'target_name': 'Depression'
    }
    print(f"Saving feature information to {FEATURE_PATH}...")
    dump(feature_data, FEATURE_PATH)
    
    print("Training completed successfully!")

if __name__ == "__main__":
    train_svm_model()