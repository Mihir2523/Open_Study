# mongodb.py
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.environ.get("MONGO_URI")
DATABASE_NAME = "OpenStudy"

_client: AsyncIOMotorClient | None = None
_db = None

async def get_db():
    """Return the database instance. Initialize if not already connected."""
    global _client, _db
    if _db is None:
        _client = AsyncIOMotorClient(MONGO_URI)
        _db = _client[DATABASE_NAME]
        print("✅ Connected to MongoDB Atlas")
    return _db

async def close_connection():
    global _client
    if _client:
        _client.close()
        print("🔒 MongoDB connection closed")