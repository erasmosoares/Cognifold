from pydantic import BaseModel
from typing import List, Optional

class ResearchRequest(BaseModel):
    company: str

class ReviewRequest(BaseModel):
    theme: str

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []
    agent_type: Optional[str] = "cognifold"
