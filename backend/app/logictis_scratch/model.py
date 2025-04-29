import numpy as np

class LogisticRegression:
    def __init__(self, learning_rate=0.01, epochs=1000, threshold=0.5):
        self.learning_rate = learning_rate
        self.epochs = epochs
        self.threshold = threshold
        self.weights = None
    
    def sigmoid(self, z):
        """Sigmoid activation function"""
        # Ensure z is a numpy array
        z = np.array(z, dtype=np.float64)
        return 1 / (1 + np.exp(-z))
    
    def compute_log_loss(self, y_true, y_pred):
        """Compute log loss (binary cross-entropy)"""
        epsilon = 1e-15  # Avoid log(0)
        y_pred = np.clip(y_pred, epsilon, 1 - epsilon)
        return -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))
    
    def fit(self, X, y):
        """Train logistic regression model using gradient descent"""
        # Ensure X and y are numpy arrays
        X = np.array(X, dtype=np.float64)
        y = np.array(y, dtype=np.float64)
        
        # Store original X for prediction
        self.X = X
        
        # Add bias term (intercept)
        m, n = X.shape
        X_with_bias = np.hstack([np.ones((m, 1), dtype=np.float64), X])
        
        # Initialize weights
        self.weights = np.zeros(n + 1, dtype=np.float64)
        
        # Gradient descent
        for _ in range(self.epochs):
            # Forward pass
            z = X_with_bias.dot(self.weights)
            y_pred = self.sigmoid(z)
            
            # Compute gradient
            gradient = (X_with_bias.T.dot(y_pred - y)) / m
            
            # Update weights
            self.weights -= self.learning_rate * gradient
            
        return self
    
    def predict_proba(self, X):
        """Predict probability of class 1"""
        # Ensure X is a numpy array
        X = np.array(X, dtype=np.float64)
        
        # Add bias term
        m = X.shape[0]
        X_with_bias = np.hstack([np.ones((m, 1), dtype=np.float64), X])
        
        # Calculate probabilities
        z = X_with_bias.dot(self.weights)
        return self.sigmoid(z)
    
    def predict(self, X):
        """Predict class labels"""
        probabilities = self.predict_proba(X)
        return (probabilities >= self.threshold).astype(int)
    
    def score(self, X, y):
        """Calculate accuracy score"""
        y_pred = self.predict(X)
        return np.mean(y_pred == y)
