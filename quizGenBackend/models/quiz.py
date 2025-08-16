from typing import List, Literal
from pydantic import BaseModel, Field
from datetime import datetime

class QuizQuestion(BaseModel):
    question: str = Field(..., description="Quiz question text")
    options: List[str] = Field(default_factory=list, description="List of options (empty list for true/false)")
    answer: str = Field(..., description="Correct answer")
    type: Literal["mcq", "true_false"] = Field(..., description="Question type: 'mcq' or 'true_false'")
    difficulty: Literal["easy", "medium", "hard"] = Field(..., description="Difficulty level")

class Quiz(BaseModel):
    title: str = Field(..., description="Title of quiz")
    questions: List[QuizQuestion] = Field(..., description="List of quiz questions")
    created_by: str = Field(..., description="User ID of the quiz creator")
    created_at: str = Field(description="Quiz creation timestamp")

def obj_id_to_str(doc):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc