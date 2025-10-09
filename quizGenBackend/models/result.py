from typing import List
from pydantic import BaseModel, Field
from datetime import datetime


class Result(BaseModel):
    quizId: str = Field(..., description="Quiz ID this result belongs to")
    userId: str = Field(..., description="User ID of the participant")
    marks: int = Field(..., description="Marks scored by the user")
    total: int = Field(..., description="Total possible marks")
    answers: List[int] = Field(..., description="User's submitted answers (index wise)")
    submitted_at: datetime = Field(default_factory=datetime.utcnow, description="Submission timestamp")

def obj_id_to_str(doc: dict) -> dict:
    """Convert Mongo _id to string 'id' for API responses."""
    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc