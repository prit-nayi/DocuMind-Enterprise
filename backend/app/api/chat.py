from typing import List, Optional

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.rag.generator import generate_answer, stream_answer
from app.rag.retriever import retrieve_chunks

router = APIRouter()


class HistoryMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    question: str
    history: Optional[List[HistoryMessage]] = None


@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Non-streaming chat endpoint.
    Returns complete answer immediately.
    """
    question = request.question
    history = (
        [message.model_dump() for message in request.history]
        if request.history
        else []
    )

    try:
        chunks = retrieve_chunks(question, history=history)
        answer, sources = generate_answer(question, chunks, history=history)

        return {
            "answer": answer,
            "sources": sources,
        }
    except Exception as e:
        return {
            "answer": f"An error occurred: {str(e)}",
            "sources": [],
        }


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    Streaming chat endpoint.
    Uses Server-Sent Events (SSE) format for real-time token delivery.
    
    Response format:
    - type: "content" | "sources" | "done"
    - data: token string or sources list
    
    Example:
    {"type": "content", "data": "Hello"}
    {"type": "content", "data": " world"}
    {"type": "sources", "data": [...]}
    {"type": "done"}
    """
    question = request.question
    history = (
        [message.model_dump() for message in request.history]
        if request.history
        else []
    )

    async def generate():
        try:
            chunks = retrieve_chunks(question, history=history)
            # Yield tokens as they are generated
            for event in stream_answer(question, chunks, history=history):
                yield event
        except Exception as e:
            import json
            yield json.dumps({"type": "error", "data": str(e)}) + "\n"
            yield json.dumps({"type": "done"}) + "\n"

    return StreamingResponse(
        generate(),
        media_type="application/x-ndjson",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )