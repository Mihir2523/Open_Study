from fastapi import APIRouter, HTTPException, Body
from pathlib import Path
import json
from datetime import datetime
from bson import ObjectId

from utils.database import get_db
from models.result import Result, obj_id_to_str

router = APIRouter()

# Directory to store cached active quizzes
ACTIVE_DIR = Path("active_quizzes")
ACTIVE_DIR.mkdir(exist_ok=True)


@router.post("/start-quiz")
async def start_quiz(quizId: str = Body(..., embed=True)):
    """
    Start a quiz: fetch from DB, cache it locally for grading.
    """
    if not ObjectId.is_valid(quizId):
        raise HTTPException(status_code=400, detail="Invalid quiz ID format")

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
        "cachedAt": datetime.utcnow().isoformat(),
    }

    quiz_file = ACTIVE_DIR / f"active_{quizId}.json"
    quiz_file.write_text(json.dumps(cache, indent=2), encoding="utf-8")

    return {
        "ok": True,
        "message": "Quiz cached",
        "quizId": cache["quizId"],
        "questionCount": len(cache["questions"]),
    }


@router.get("/active-quiz/{quizId}")
async def get_active_quiz(quizId: str):
    """
    Get the cached active quiz by quizId.
    """
    quiz_file = ACTIVE_DIR / f"active_{quizId}.json"
    if not quiz_file.exists():
        raise HTTPException(status_code=404, detail="No active quiz found")

    data = json.loads(quiz_file.read_text(encoding="utf-8"))
    return data


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
    insert_res = await db.results.insert_one(result.dict())
    new_result = await db.results.find_one({"_id": insert_res.inserted_id})

    return {"ok": True, "result": obj_id_to_str(new_result)}


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