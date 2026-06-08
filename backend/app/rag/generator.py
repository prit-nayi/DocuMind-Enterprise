from huggingface_hub import InferenceClient

from app.config import settings
from app.rag.prompt import build_prompt


def _extract_sources(chunks):
    seen = set()
    sources = []

    for chunk in chunks:
        metadata = chunk.get("metadata", {})
        source = metadata.get("source", "unknown")
        page = metadata.get("page")
        key = (source, page)

        if key not in seen:
            seen.add(key)
            sources.append({
                "document": source,
                "page": page,
            })

    return sources


def _call_huggingface(prompt):
    if not settings.huggingfacehub_api_token:
        raise ValueError("Hugging Face API token is not configured.")

    client = InferenceClient(model=settings.hf_model, token=settings.huggingfacehub_api_token)
    response = client.text_generation(
        prompt,
        max_new_tokens=256,
        temperature=0.2,
        top_p=0.95,
        return_full_text=False,
    )

    if isinstance(response, str):
        answer = response
    elif hasattr(response, "generated_text"):
        answer = response.generated_text
    else:
        answer = str(response)

    return answer.strip()


def generate_answer(question, chunks, history=None):
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
    except Exception:
        answer = "I can only answer based on the uploaded documents."

    sources = _extract_sources(chunks)
    return answer, sources