from fastapi import FastAPI, HTTPException, Form, UploadFile, File
from contextlib import asynccontextmanager
from utils.database import get_db, close_connection
from models.quiz import obj_id_to_str
from utils.quiz_gen import QuizGenerator
from utils.text_extraction import FileTextExtractor
import json
from pathlib import Path
import shutil

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic here (if needed, e.g., test DB connection)
    db = await get_db()
    print("✅ DB ready on startup")
    yield
    # Shutdown logic
    await close_connection()
    print("🔒 DB connection closed")

TEMP_DIR = Path("temp")
TEMP_DIR.mkdir(exist_ok=True)  # create temp folder if not exists

async def save_quiz_to_db(questions, created_by):
    db = await get_db()
    quiz_data = {"questions": questions, "created_by": created_by}
    result = await db.quiz.insert_one(quiz_data)
    new_quiz = await db.quiz.find_one({"_id": result.inserted_id})
    return obj_id_to_str(new_quiz)

def save_uploaded_file(file: UploadFile) -> Path:
    temp_path = TEMP_DIR / file.filename
    with open(temp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return temp_path

app = FastAPI(title="OpenStudy Quiz Gen", lifespan=lifespan)

@app.get("/")
async def root():
    return {"message": "Welcome to OpenStudy Quiz Generator API"}

@app.post("/generate_quiz/text")
async def generate_quiz_from_text(
    text: str = Form(...),
    count: int = Form(5),
    qtype: str = Form("mcq"),
    difficulty: str = Form("medium"),
    option_count: int = Form(4),
    created_by: str = Form(...)
):
    """
    Generate quiz from raw text and save to DB.
    """
    quiz_gen = QuizGenerator()
    quiz_json = quiz_gen.generate_as_json(
        text=text,
        count=count,
        qtype=qtype,
        difficulty=difficulty,
        option_count=option_count
    )
    questions = json.loads(quiz_json)
    return await save_quiz_to_db(questions, created_by)


@app.post("/generate_quiz/pdf")
async def generate_quiz_from_pdf(
    file: UploadFile = File(...),
    count: int = Form(5),
    qtype: str = Form("mcq"),
    difficulty: str = Form("medium"),
    option_count: int = Form(4),
    created_by: str = Form(...)
):
    """
    Generate quiz from PDF file and save to DB.
    """
    temp_path = save_uploaded_file(file)
    text = FileTextExtractor.extract_text(str(temp_path))
    temp_path.unlink()

    if not text.strip():
        raise HTTPException(status_code=400, detail="No text found in PDF")

    quiz_gen = QuizGenerator()
    quiz_json = quiz_gen.generate_as_json(
        text=text,
        count=count,
        qtype=qtype,
        difficulty=difficulty,
        option_count=option_count
    )
    questions = json.loads(quiz_json)
    return await save_quiz_to_db(questions, created_by)


@app.post("/generate_quiz/ppt")
async def generate_quiz_from_ppt(
    file: UploadFile = File(...),
    count: int = Form(5),
    qtype: str = Form("mcq"),
    difficulty: str = Form("medium"),
    option_count: int = Form(4),
    created_by: str = Form(...)
):
    """
    Generate quiz from PPT file and save to DB.
    """
    temp_path = save_uploaded_file(file)
    text = FileTextExtractor.extract_text(str(temp_path))
    temp_path.unlink()

    if not text.strip():
        raise HTTPException(status_code=400, detail="No text found in PPT")

    quiz_gen = QuizGenerator()
    quiz_json = quiz_gen.generate_as_json(
        text=text,
        count=count,
        qtype=qtype,
        difficulty=difficulty,
        option_count=option_count
    )
    questions = json.loads(quiz_json)
    return await save_quiz_to_db(questions, created_by)