from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import FileResponse
from pathlib import Path
import json
from datetime import datetime
from bson import ObjectId
import uuid
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet

from utils.database import get_db
from models.result import Result, obj_id_to_str

router = APIRouter()

# Directory to store cached active quizzes
ACTIVE_DIR = Path("active_quizzes")
ACTIVE_DIR.mkdir(exist_ok=True)


@router.post("/start-quiz")
async def start_quiz(quizId: str = Body(..., embed=True)):
    """
    Start a quiz: return cached quiz if exists, else fetch from DB and cache it.
    Correct answers are never exposed in the response.
    """
    if not ObjectId.is_valid(quizId):
        raise HTTPException(status_code=400, detail="Invalid quiz ID format")

    quiz_file = ACTIVE_DIR / f"active_{quizId}.json"

    if quiz_file.exists():
        # Quiz is already cached
        data = json.loads(quiz_file.read_text(encoding="utf-8"))
        del data["answers"]  # Do not expose correct answers
        print(data)
        return {
            "ok": True,
            "message": "Quiz fetched from cache",
            "questionCount": len(data["questions"]),
            "quiz": data,
        }

    # Not cached yet — fetch from DB
    db = await get_db()
    quiz = await db.quiz.find_one({"_id": ObjectId(quizId)})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    cache = {
        "quizId": str(quiz["_id"]),
        "title": quiz.get("title", ""),
        "questions": [
            {
                "question": q.get("question"),
                "options": q.get("options"),
                "type": q.get("type", "mcq"),
                "weightage": q.get("weightage", 1),
                "difficulty": q.get("difficulty", "medium"),
            }
            for q in quiz.get("questions", [])
        ],
        "answers": quiz.get("answers", []),
        "timeLimit": quiz.get("time_limit", 0),
        "date_of_quiz": quiz.get("date_of_quiz").isoformat() if quiz.get("date_of_quiz") else None,
        "cachedAt": datetime.utcnow().isoformat(),
    }

    # Cache the quiz
    quiz_file.write_text(json.dumps(cache, indent=2, default=str), encoding="utf-8")

    # Remove answers before sending to client
    response = dict(cache)
    print(response)
    del response["answers"]

    return {
        "ok": True,
        "message": "Quiz cached",
        "questionCount": len(response["questions"]),
        "quiz": response,
    }


@router.post("/submit")
async def submit_quiz(
    userId: str = Body(...),
    quizId: str = Body(...),
    answers: list[int] = Body(...),
):
    """
    Submit quiz answers and calculate score.
    """
    quiz_file = ACTIVE_DIR / f"active_{quizId}.json"
    if not quiz_file.exists():
        raise HTTPException(status_code=404, detail="Quiz not active or not found")

    quiz = json.loads(quiz_file.read_text(encoding="utf-8"))
    correct_answers = quiz.get("answers", [])
    total = len(quiz.get("questions", []))

    if len(answers) != total:
        raise HTTPException(
            status_code=400,
            detail=f"Expected {total} answers, got {len(answers)}",
        )

    marks = sum(
        quiz["questions"][i].get("weightage", 1)
        for i in range(total)
        if answers[i] == correct_answers[i]
    )

    result = Result(
        quizId=quizId,
        userId=userId,
        marks=marks,
        total=total,
        answers=answers,
    )

    db = await get_db()
    insert_res = await db.results.insert_one(result.model_dump())
    new_result = await db.results.find_one({"_id": insert_res.inserted_id})

    return {"ok": True, "result": obj_id_to_str(new_result)}


@router.get("/results/{quizId}")
async def get_quiz_results(quizId: str):
    """
    Get all user results for a given quiz ID.
    """
    db = await get_db()
    cursor = db.results.find({"quizId": quizId})

    results = []
    async for doc in cursor:
        results.append(obj_id_to_str(doc))

    if not results:
        raise HTTPException(status_code=404, detail="No results found for this quiz")

    return {"quizId": quizId, "results": results}

@router.post("/download-results")
async def download_quiz_results(payload: dict = Body(...)):
    """
    Generate a PDF for quiz results and return file.
    """
    results = payload["results"]
    filename = f"./results/quiz_results_{uuid.uuid4().hex}.pdf"
    file_path = Path(filename)

    doc = SimpleDocTemplate(str(file_path), pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph("Quiz Results", styles['Title']))
    elements.append(Paragraph(" ", styles['Normal']))

    data = [["Email", "Marks", "Total", "Submitted At"]]

    for r in results:
        data.append([
            r.get("userId", ""),
            str(r.get("marks", "")),
            str(r.get("total", "")),
            r.get("submitted_at", "")
        ])

    table = Table(data, colWidths=[150, 60, 60, 150])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.darkgreen),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        
        ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
        
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),

        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))

    elements.append(table)

    # build pdf
    doc.build(elements)

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/pdf"
    )

@router.get("/results/{userId}")
async def get_user_results(userId: str):
    """
    Get all quiz results for a given user.
    """
    db = await get_db()
    cursor = db.results.find({"userId": userId})

    results = []
    async for doc in cursor:
        results.append(obj_id_to_str(doc))

    if not results:
        raise HTTPException(status_code=404, detail="No results found for this user")

    return {"results": results}