from fastapi import APIRouter, Header, Depends
from typing import Optional
from app.core.security import set_keys
from app.core.logging import get_sse_response
from app.models.requests import ResearchRequest, ReviewRequest, ChatRequest
from app.services.research_agent import research_agent
from app.services.review_agent import review_agent
from app.services.chat_agent import cognifold_agent, therapy_agent

router = APIRouter()

@router.get("/sse-logs")
async def sse_logs():
    return get_sse_response()

@router.post("/research")
async def research_company(
    request: ResearchRequest,
    x_openai_api_key: Optional[str] = Header(None),
    x_serper_api_key: Optional[str] = Header(None)
):
    set_keys(x_openai_api_key, x_serper_api_key)
    result = await research_agent.run(request.company)
    return {"result": result}

@router.post("/review")
async def review_specialists_endpoint(
    request: ReviewRequest,
    x_openai_api_key: Optional[str] = Header(None)
):
    set_keys(x_openai_api_key, None)
    result = await review_agent.run(request.theme)
    return {"result": result}

@router.post("/chat")
async def chat_endpoint(
    request: ChatRequest,
    x_openai_api_key: Optional[str] = Header(None)
):
    set_keys(x_openai_api_key, None)
    response = await cognifold_agent.run(request.message, context={'history': request.history})
    return {"response": response}

@router.post("/chat-therapy")
async def therapy_chat_endpoint(
    request: ChatRequest,
    x_openai_api_key: Optional[str] = Header(None)
):
    set_keys(x_openai_api_key, None)
    response = await therapy_agent.run(request.message, context={'history': request.history})
    return {"response": response}
