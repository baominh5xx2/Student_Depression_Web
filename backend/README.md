# FastAPI Model Development Project

A simple FastAPI project structure for model development and deployment.

## Project Structure

```
.
├── app/
│   ├── models/           # Model implementation
│   │   ├── __init__.py
│   │   └── model.py      # Model class
│   ├── routes/           # API routes
│   │   ├── __init__.py
│   │   └── prediction.py # Prediction endpoints
│   └── __init__.py
├── main.py               # FastAPI application
├── requirements.txt      # Project dependencies
└── README.md             # This file
```

## Getting Started

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the server:
   ```
   python main.py
   ```
   or
   ```
   uvicorn main:app --reload
   ```

3. Access the API documentation:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## API Endpoints

- `GET /`: Root endpoint
- `GET /health`: Health check endpoint
- `POST /api/predictions/`: Make predictions using the model
- `POST /api/predictions/train`: Train the model with new data

## Development

To extend this project:

1. Implement your machine learning model in `app/models/model.py`
2. Add additional routes as needed in the `app/routes/` directory
3. Configure environment variables in a `.env` file (using python-dotenv)

## Testing

Add tests to a `tests/` directory and run them with pytest:

```
pytest
``` 