from fastapi import FastAPI
from contextlib import asynccontextmanager

from utils.database import get_db, close_connection
from routers.generate_quiz import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic here (if needed, e.g., test DB connection)
    db = await get_db()
    print("✅ DB ready on startup")
    yield
    # Shutdown logic
    await close_connection()
    print("🔒 DB connection closed")


app = FastAPI(title="OpenStudy Quiz Gen", lifespan=lifespan)

# CORS: allow all origins, methods, and headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # accept requests from any origin
    allow_credentials=False,    # must be False when using "*" for allow_origins
    allow_methods=["*"],        # allow all HTTP methods
    allow_headers=["*"],        # allow all headers
)

app.include_router(router, prefix="/generate_quiz", tags=['Quiz Gen'])

@app.get("/")
async def root():
    return {"message": "Welcome to OpenStudy Quiz Generator API"}
