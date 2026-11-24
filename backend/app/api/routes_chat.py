"""Chat & Assistant orchestration endpoint."""

from fastapi import APIRouter
from app.models.schemas import ChatMessagePayload, ChatResponsePayload
from app.orchestrator.agent import orchestrator

router = APIRouter(prefix="/api/chat", tags=["Chat Orchestration"])


@router.post("/message", response_model=ChatResponsePayload)
async def process_chat_message(payload: ChatMessagePayload):
    """Processes user chat messages through the Agent Orchestrator with dynamic MCP tools."""
    response = await orchestrator.handle_message(
        conversation_id=payload.conversation_id,
        message=payload.message,
        context=payload.context
    )
    return response
