from typing import List, Optional

from fastapi import APIRouter
from pydantic import BaseModel

from app.rag.generator import generate_answer
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
    question = request.question
    history = [message.model_dump() for message in request.history] if request.history else []

    chunks = retrieve_chunks(question, history=history)
    answer, sources = generate_answer(question, chunks, history=history)

    return {
        "answer": answer,
        "sources": sources,
    }