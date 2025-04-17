import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
from joblib import dump, load

def train_depression_model():
    # Check if model already exists
    model_path = 'depression_model.joblib'
    if os.path.exists(model_path):
        print(f"Model already exists at {model_path}. Skipping training.")
        return
    
    # Load and preprocess data
    df = pd.read_csv('Student Depression Dataset.csv')
    
    # Data preprocessing
    df['Gender'] = df['Gender'].astype('category')
    df['City'] = df['City'].astype('category')
    
    df.rename(columns={'Have you ever had suicidal thoughts ?': 'Suicidal_Thoughts'}, inplace=True)
    df['Suicidal_Thoughts'] = df['Suicidal_Thoughts'].map({'Yes': 1, 'No': 0})
    df['Family History of Mental Illness'] = df['Family History of Mental Illness'].map({'Yes': 1, 'No': 0})
    
    # Handle Sleep Duration
    df['Sleep Duration'] = df['Sleep Duration'].str.replace('"', '', regex=False).str.strip("'").str.strip()
    
    sleep_mapping = {
        'Less than 5 hours': 4.0,
        '5-6 hours': 5.5,
        '7-8 hours': 7.5,
        'More than 8 hours': 9.0,
        'Others': np.nan
    }
    
    df['Sleep Duration'] = df['Sleep Duration'].map(sleep_mapping)
    median_sleep = df['Sleep Duration'].median()
    df['Sleep Duration'] = df['Sleep Duration'].fillna(median_sleep)
    df['Sleep Duration'] = df['Sleep Duration'].astype(float)
    
    # Convert numeric columns
    numeric_cols = ['Age', 'Academic Pressure', 'Work Pressure', 'CGPA',
                   'Study Satisfaction', 'Job Satisfaction', 'Work/Study Hours',
                   'Financial Stress', 'Depression']
    
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    
    df['Family History of Mental Illness'] = pd.to_numeric(df['Family History of Mental Illness'], errors='coerce')
    
    # Drop unnecessary columns
    df.drop(columns=['id', 'City'], inplace=True)
    
    # One-hot encoding
    categorical_cols = ['Gender', 'Profession', 'Dietary Habits', 'Degree']
    df_encoded = pd.get_dummies(df, columns=categorical_cols, drop_first=True)
    
    # Handle missing values
    df_encoded = df_encoded.dropna(subset=['Financial Stress'])
    
    # Prepare features and target
    X = df_encoded.drop('Depression', axis=1)
    y = df_encoded['Depression']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    model = LogisticRegression(max_iter=1000)
    model.fit(X_train, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test)
    print("Model Performance Metrics:")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    print(f"\nModel Accuracy: {model.score(X_test, y_test):.4f}")
    # Save model and features
    os.makedirs('models', exist_ok=True)
    dump(model, model_path)
    
    feature_data = {
        'feature_names': X.columns.tolist(),
        'target_name': 'Depression'
    }
    feature_path = 'feature_names.joblib'
    dump(feature_data, feature_path)
    
    print(f"\nModel saved to: {model_path}")
    print(f"Feature information saved to: {feature_path}")

if __name__ == "__main__":
    train_depression_model()