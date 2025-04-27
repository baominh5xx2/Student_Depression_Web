from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.routes.prediction import router as prediction_router
from app.routes.history import router as history_router
from app.database.mongodb import MongoDB
from app.database.history_db import HistoryDB
import logging
from app.svm_lib.routes import router as svm_router

# Cấu hình logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)



# Tạo ứng dụng FastAPI
app = FastAPI(title="Model API", description="API for ML model prediction")

@app.on_event("startup")
async def startup_db_client():
    await MongoDB.init()
    HistoryDB.init(MongoDB.client)
    logger.info("Đã kết nối MongoDB")

# Đóng kết nối khi tắt ứng dụng
@app.on_event("shutdown")
async def shutdown_db_client():
    await MongoDB.close()  # Gọi đúng method async
    logger.info("Đã đóng kết nối MongoDB")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(prediction_router)
app.include_router(history_router)
app.include_router(svm_router)

@app.get("/")
async def root():
    return {"message": "Welcome to Model API"}

@app.get("/health")
async def health_check():
    try:
        MongoDB.client.admin.command("ping")
        db_status = "connected"
    except Exception as e:
        db_status = "disconnected"
        logger.error(f"Database health check failed: {e}")
    
    return {"status": "healthy", "database": db_status}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)