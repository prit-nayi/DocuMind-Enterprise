from fastapi import APIRouter
from pydantic import BaseModel

from app.rag.retriever import retrieve_chunks
from app.rag.generator import generate_answer

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/chat")
async def chat(request: ChatRequest):

    question = request.question

    # Retrieve relevant chunks
    chunks = retrieve_chunks(question)

    # Generate answer
    answer = generate_answer(
        question,
        chunks
    )

    return {
        "answer": answer,
        "sources": [
            {
                "document": "employee_policy.pdf",
                "page": 14
            }
        ]
    }