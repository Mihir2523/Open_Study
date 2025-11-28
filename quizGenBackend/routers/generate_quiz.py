from fastapi import APIRouter, Form, UploadFile, File, HTTPException
from pathlib import Path
from bson import ObjectId
import json
import shutil
from datetime import datetime
from fastapi.responses import FileResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch


from utils.database import get_db
from models.quiz import obj_id_to_str
from utils.quiz_gen import QuizGenerator
from utils.text_extraction import FileTextExtractor


TEMP_DIR = Path("temp")
TEMP_DIR.mkdir(exist_ok=True)  # create temp folder if not exists

async def save_quiz_to_db(quiz, created_by, title, time_limit=30, date_of_quiz=None):
    db = await get_db()
    quiz_data = {"title": title, "questions": quiz['questions'], "answers": quiz["answers"], "created_by": created_by, "created_at": str(datetime.now()), "time_limit": time_limit, "date_of_quiz": date_of_quiz or datetime.now()}
    result = await db.quiz.insert_one(quiz_data)
    new_quiz = await db.quiz.find_one({"_id": result.inserted_id})
    return obj_id_to_str(new_quiz)

def save_uploaded_file(file: UploadFile) -> Path:
    temp_path = TEMP_DIR / file.filename
    with open(temp_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return temp_path

def generate_quiz_pdf(quiz, file_path: Path):
    styles = getSampleStyleSheet()
    story = []

    # Title
    story.append(Paragraph(f"<b>{quiz['title']}</b>", styles["Title"]))
    story.append(Spacer(1, 20))

    # Safe weightage handling
    if "weightage" in quiz:
        story.append(Paragraph(f"Total Weightage: {quiz['weightage']}", styles["Normal"]))
    else:
        # Auto compute weightage if missing
        computed_weight = sum(q["weightage"] for q in quiz["questions"])
        story.append(Paragraph(f"Total Weightage: {computed_weight} (auto-calculated)", styles["Normal"]))

    story.append(Paragraph(f"Time Limit: {quiz.get('time_limit', 'N/A')} minutes", styles["Normal"]))
    story.append(Spacer(1, 20))

    # Render questions
    for idx, q in enumerate(quiz["questions"], start=1):
        story.append(Paragraph(f"<b>{idx}. {q['question']}</b>", styles["Normal"]))
        story.append(Paragraph(f"(Difficulty: {q['difficulty']}, Marks: {q['weightage']})", styles["Italic"]))
        story.append(Spacer(1, 10))

        if q["type"] == "mcq":
            for op_i, opt in enumerate(q["options"], start=1):
                story.append(Paragraph(f"{op_i}) {opt}", styles["Normal"]))
            story.append(Spacer(1, 15))

        else:
            story.append(Paragraph("1) True", styles["Normal"]))
            story.append(Paragraph("2) False", styles["Normal"]))
            story.append(Spacer(1, 15))

    pdf = SimpleDocTemplate(str(file_path), pagesize=A4)
    pdf.build(story)

    return file_path

router = APIRouter()

@router.post("/text")
async def generate_quiz_from_text(
    title: str = Form(...),
    text: str = Form(...),
    count: int = Form(5),
    qtype: str = Form("mcq"),
    difficulty: str = Form("medium"),
    weightage: int = Form(1),
    option_count: int = Form(4),
    created_by: str = Form(...),
    time_limit: int = Form(30),
    date_of_quiz: datetime = Form(None)
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
        weightage=weightage,
        option_count=option_count
    )
    quiz = json.loads(quiz_json)
    # return await save_quiz_to_db(quiz, created_by, title, time_limit, date_of_quiz)
    return {
        "preview": True,
        "title": title,
        "created_by": created_by,
        "time_limit": time_limit,
        "date_of_quiz": date_of_quiz,
        "questions": quiz["questions"],
        "answers": quiz["answers"]
    }


@router.post("/pdf")
async def generate_quiz_from_pdf(
    title: str = Form(...),
    file: UploadFile = File(...),
    count: int = Form(5),
    qtype: str = Form("mcq"),
    difficulty: str = Form("medium"),
    weightage: int = Form(1),
    option_count: int = Form(4),
    created_by: str = Form(...),
    time_limit: int = Form(30),
    date_of_quiz: datetime = Form(None)
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
        weightage= weightage,
        option_count=option_count
    )
    quiz = json.loads(quiz_json)
    #return await save_quiz_to_db(quiz, created_by, title, time_limit, date_of_quiz)
    return {
        "preview": True,
        "title": title,
        "created_by": created_by,
        "time_limit": time_limit,
        "date_of_quiz": date_of_quiz,
        "questions": quiz["questions"],
        "answers": quiz["answers"]
    }


@router.post("/ppt")
async def generate_quiz_from_ppt(
    title: str = Form(...),
    file: UploadFile = File(...),
    count: int = Form(5),
    qtype: str = Form("mcq"),
    difficulty: str = Form("medium"),
    weightage: int = Form(1),
    option_count: int = Form(4),
    created_by: str = Form(...),
    time_limit: int = Form(30),
    date_of_quiz: datetime = Form(None)
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
        weightage=weightage,
        option_count=option_count
    )
    quiz = json.loads(quiz_json)
    # return await save_quiz_to_db(quiz, created_by, title, time_limit, date_of_quiz)
    return {
        "preview": True,
        "title": title,
        "created_by": created_by,
        "time_limit": time_limit,
        "date_of_quiz": date_of_quiz,
        "questions": quiz["questions"],
        "answers": quiz["answers"]
    }
    
@router.post("/save")
async def save_generated_quiz(payload: dict):
    db = await get_db()

    required_fields = ["title", "questions", "answers", "created_by"]
    for field in required_fields:
        if field not in payload:
            raise HTTPException(status_code=400, detail=f"Missing field: {field}")

    payload["created_at"] = str(datetime.now())
    payload["date_of_quiz"] = payload.get("date_of_quiz", datetime.now())

    result = await db.quiz.insert_one(payload)
    new_quiz = await db.quiz.find_one({"_id": result.inserted_id})
    
    return obj_id_to_str(new_quiz)


@router.get("/{id}")
async def get_quiz_from_id(
    id: str,
):
    """
    Get all the quiz generated by the user with given id
    """
    db = await get_db()
    cursor = db.quiz.find({"created_by": id})

    quizzes = []
    async for quiz in cursor:
        quiz["id"] = str(quiz["_id"])
        del quiz["_id"]
        quizzes.append(quiz)

    if not quizzes:
        raise HTTPException(status_code=404, detail="No quizzes found for this user")

    return {"quizzes": quizzes}

@router.delete("/delete/{quiz_id}")
async def delete_quiz(quiz_id: str):
    """
    Delete a quiz by its ObjectId.
    """
    db = await get_db()

    # Validate ObjectId
    if not ObjectId.is_valid(quiz_id):
        raise HTTPException(status_code=400, detail="Invalid quiz ID format")

    result = await db.quiz.delete_one({"_id": ObjectId(quiz_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Quiz not found")

    return {"status": "success", "message": "Quiz deleted successfully"}

@router.get("/download/{quiz_id}")
async def download_quiz_pdf(quiz_id: str):
    """
    Generate a PDF question paper from quiz ID and send it for download.
    Only questions are included, not answers.
    """
    db = await get_db()

    # Validate ID format
    if not ObjectId.is_valid(quiz_id):
        raise HTTPException(status_code=400, detail="Invalid Quiz ID")

    # Fetch quiz
    quiz = await db.quiz.find_one({"_id": ObjectId(quiz_id)})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    # Convert _id to string for internal usage
    quiz["id"] = str(quiz["_id"])
    del quiz["_id"]

    # Prepare path
    pdf_path = TEMP_DIR / f"quiz_{quiz_id}.pdf"

    # Generate question paper PDF
    generate_quiz_pdf(quiz, pdf_path)

    return FileResponse(
        path=pdf_path,
        filename=f"{quiz['title']}.pdf",
        media_type="application/pdf"
    )
