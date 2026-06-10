import json
from pathlib import Path
from typing import Generator, List, Optional, Tuple

from huggingface_hub import InferenceClient

from app.config import settings
from app.rag.prompt import build_prompt


def _extract_sources(chunks):
    seen = set()
    sources = []

    for chunk in chunks:
        metadata = chunk.get("metadata", {})
        source = metadata.get("source", "unknown")
        if source != "unknown":
            source = Path(str(source)).name
        page = metadata.get("page")
        key = (source, page)

        if key not in seen:
            seen.add(key)
            sources.append({
                "document": source,
                "page": page,
            })

    return sources


def _build_messages(prompt: str) -> List[dict]:
    return [{"role": "user", "content": prompt}]


def _get_inference_client() -> InferenceClient:
    if not settings.huggingfacehub_api_token:
        raise ValueError("Hugging Face API token is not configured.")

    return InferenceClient(
        model=settings.hf_model,
        token=settings.huggingfacehub_api_token,
    )


def _extract_stream_token(chunk) -> str:
    if isinstance(chunk, str):
        return chunk

    choices = getattr(chunk, "choices", None) or []
    if not choices:
        return ""

    choice = choices[0]
    delta = getattr(choice, "delta", None)
    if delta is not None:
        content = getattr(delta, "content", None)
        if content:
            return content

    text = getattr(choice, "text", None)
    return text or ""


def _format_inference_error(error: Exception) -> str:
    message = str(error).strip()
    if message:
        return message

    if isinstance(error, StopIteration):
        return (
            f"Model '{settings.hf_model}' is not supported by the Hugging Face "
            "Inference API. Set HF_MODEL to a chat model such as "
            "Qwen/Qwen2.5-7B-Instruct."
        )

    return f"{type(error).__name__}: inference request failed."


def _call_huggingface(prompt: str) -> str:
    client = _get_inference_client()
    response = client.chat_completion(
        messages=_build_messages(prompt),
        max_tokens=512,
        temperature=0.2,
        top_p=0.95,
    )

    choices = getattr(response, "choices", None) or []
    if not choices:
        return ""

    message = getattr(choices[0], "message", None)
    content = getattr(message, "content", None) if message else None
    return (content or "").strip()


def _stream_huggingface(prompt: str) -> Generator[str, None, None]:
    client = _get_inference_client()

    for chunk in client.chat_completion(
        messages=_build_messages(prompt),
        max_tokens=512,
        temperature=0.2,
        top_p=0.95,
        stream=True,
    ):
        token = _extract_stream_token(chunk)
        if token:
            yield token


def stream_answer(
    question: str,
    chunks: List,
    history: Optional[List] = None,
) -> Generator[str, None, None]:
    """
    Stream tokens from RAG pipeline.
    Yields JSON-formatted server-sent events.
    """
    if not chunks:
        yield json.dumps({"type": "content", "data": "I can only answer based on the uploaded documents."}) + "\n"
        yield json.dumps({"type": "sources", "data": []}) + "\n"
        yield json.dumps({"type": "done"}) + "\n"
        return

    prompt = build_prompt(question, chunks, history)
    sources = _extract_sources(chunks)

    try:
        for token in _stream_huggingface(prompt):
            yield json.dumps({"type": "content", "data": token}) + "\n"

        yield json.dumps({"type": "sources", "data": sources}) + "\n"

    except Exception as e:
        error_msg = _format_inference_error(e)
        yield json.dumps({"type": "error", "data": error_msg}) + "\n"
        yield json.dumps({"type": "sources", "data": []}) + "\n"

    yield json.dumps({"type": "done"}) + "\n"


def generate_answer(
    question: str,
    chunks: List,
    history: Optional[List] = None,
) -> Tuple[str, List]:
    """
    Non-streaming answer generation (backward compatible).
    Returns complete answer and sources.
    """
    if not chunks:
        return (
            "I can only answer based on the uploaded documents.",
            [],
        )

    prompt = build_prompt(question, chunks, history)

    try:
        answer = _call_huggingface(prompt)
        if not answer:
            answer = "I can only answer based on the uploaded documents."
    except Exception as e:
        answer = f"Error generating answer: {_format_inference_error(e)}"

    sources = _extract_sources(chunks)
    return answer, sources
