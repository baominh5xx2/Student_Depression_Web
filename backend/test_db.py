import pymongo
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def test_mongodb_connection():
    try:
        # Create MongoDB client
        client = pymongo.MongoClient(
            "mongodb://localhost:27017",
            serverSelectionTimeoutMS=5000
        )
        
        # Test connection with ping command
        client.admin.command('ping')
        logger.info("✅ MongoDB Connection Successful!")
        
        # Try to access database and collection
        db = client["history"]
        collection = db["data"]
        
        # Insert a test document
        test_doc = {"test": "Hello MongoDB"}
        result = collection.insert_one(test_doc)
        logger.info(f"✅ Test document inserted with id: {result.inserted_id}")
        
        # Clean up - delete test document
        collection.delete_one({"test": "Hello MongoDB"})
        logger.info("✅ Test document cleaned up")
        
        # Close connection
        client.close()
        logger.info("✅ Connection closed")
        
    except pymongo.errors.ServerSelectionTimeoutError:
        logger.error("❌ Could not connect to MongoDB. Is the service running?")
        raise
    except Exception as e:
        logger.error(f"❌ An error occurred: {e}")
        raise

if __name__ == "__main__":
    test_mongodb_connection()