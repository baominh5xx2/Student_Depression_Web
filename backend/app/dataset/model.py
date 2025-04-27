import numpy as np
import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from joblib import dump

def preprocess_depression_data(input_file_path, train_output_path, test_output_path, test_size=0.2, random_state=42):
    """
    Preprocess the Student Depression Dataset:
    1. Load data
    2. Handle missing values
    3. Convert categorical data to numeric
    4. Drop unnecessary columns
    5. One-hot encode categorical features
    6. Split into train/test sets
    7. Scale numerical features
    8. Save processed datasets to CSV files
    
    Parameters:
    -----------
    input_file_path : str
        Path to the input CSV file
    train_output_path : str
        Path where the processed training data will be saved
    test_output_path : str
        Path where the processed test data will be saved
    test_size : float, default=0.2
        Proportion of the dataset to include in the test split
    random_state : int, default=42
        Random seed for reproducibility
    
    Returns:
    --------
    X_train, X_test, y_train, y_test, scaler : The preprocessed data splits and the scaler
    """
    import pandas as pd
    import numpy as np
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import MinMaxScaler
    
    # 1. Load the dataset
    print(f"Loading dataset from {input_file_path}...")
    df = pd.read_csv(input_file_path)
    
    # 2. Handle missing values
    print("Handling missing values...")
    df = df.dropna()
    
    # 3. Map sleep duration to numeric values
    print("Converting Sleep Duration to numeric values...")
    sleep_map = {
        'Less than 5 hours': 4,
        '5-6 hours': 5.5,
        '7-8 hours': 7.5,
        'More than 8 hours': 9
    }
    df['Sleep Duration'] = df['Sleep Duration'].map(sleep_map)
    
    # Handle any NaN values from mapping
    if df['Sleep Duration'].isnull().sum() > 0:
        print(f"Found {df['Sleep Duration'].isnull().sum()} NaN values in 'Sleep Duration' after mapping")
        df['Sleep Duration'].fillna(df['Sleep Duration'].mean(), inplace=True)
    
    # 4. Drop unnecessary columns
    print("Dropping unnecessary columns...")
    df = df.drop(columns=['id', 'City', 'Profession'])
    
    # 5. One-hot encode categorical columns
    print("One-hot encoding categorical features...")
    df = pd.get_dummies(df, drop_first=True)
    
    # 6. Split data into features and target
    print("Splitting data into train and test sets...")
    X = df.drop('Depression', axis=1)
    y = df['Depression']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=random_state)
    
    # 7. Scale numerical features
    print("Scaling numerical features...")
    columns_to_scale = ['Age', 'Academic Pressure', 'Work Pressure', 'CGPA',
                        'Study Satisfaction', 'Job Satisfaction',
                        'Work/Study Hours', 'Financial Stress', 'Sleep Duration']
    
    scaler = MinMaxScaler()
    X_train[columns_to_scale] = scaler.fit_transform(X_train[columns_to_scale])
    X_test[columns_to_scale] = scaler.transform(X_test[columns_to_scale])
    
    # 8. Prepare final datasets and save to CSV
    print("Preparing final datasets...")
    train_data = X_train.copy()
    test_data = X_test.copy()
    
    train_data['Depression'] = y_train
    test_data['Depression'] = y_test
    
    print(f"Saving train data to {train_output_path}...")
    train_data.to_csv(train_output_path, index=False)
    
    print(f"Saving test data to {test_output_path}...")
    test_data.to_csv(test_output_path, index=False)
    
    # Save scaler and feature information for future use
    scaler_path = 'depression_scaler.joblib'
    feature_path = 'feature_names.joblib'
    
    feature_data = {
        'feature_names': X_train.columns.tolist(),
        'target_name': 'Depression',
        'columns_to_scale': columns_to_scale
    }
    
    print(f"Saving scaler to {scaler_path}...")
    dump(scaler, scaler_path)
    
    print(f"Saving feature information to {feature_path}...")
    dump(feature_data, feature_path)
    
    print(f"Preprocessing complete! Train shape: {train_data.shape}, Test shape: {test_data.shape}")
    
    return X_train, X_test, y_train, y_test, scaler

def create_datasets():
    """
    Check if datasets already exist and create them if they don't
    """
    # Define paths
    train_dataset_path = 'train_set_encoded.csv'
    test_dataset_path = 'test_set_encoded.csv'
    scaler_path = 'depression_scaler.joblib'
    feature_path = 'feature_names.joblib'
    
    # Check if datasets and scaler already exist
    datasets_exist = (os.path.exists(train_dataset_path) and 
                      os.path.exists(test_dataset_path) and
                      os.path.exists(scaler_path) and
                      os.path.exists(feature_path))
    
    if datasets_exist:
        print(f"All required files already exist:")
        print(f" - Train data: {train_dataset_path}")
        print(f" - Test data: {test_dataset_path}")
        print(f" - Scaler: {scaler_path}")
        print(f" - Feature info: {feature_path}")
        return
    
    # Create datasets if they don't exist
    print("Creating preprocessed datasets and scaler...")
    preprocess_depression_data(
        input_file_path='Student Depression Dataset.csv',
        train_output_path=train_dataset_path,
        test_output_path=test_dataset_path
    )

if __name__ == "__main__":
    create_datasets()