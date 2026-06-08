SYSTEM_PROMPT = (
    "You are a document-based question answering assistant. "
    "Answer only from the provided document context and do not invent facts. "
    "If the question cannot be answered from the document content, respond exactly: "
    "I can only answer based on the uploaded documents."
)


def build_prompt(question, chunks, history=None):
    history_text = ""
    if history:
        history_lines = []
        for turn in history[-10:]:
            role = turn.get("role", "user").capitalize()
            content = turn.get("content", "")
            history_lines.append(f"{role}: {content}")
        history_text = "Conversation history:\n" + "\n".join(history_lines) + "\n\n"

    context_sections = []
    for index, chunk in enumerate(chunks, start=1):
        metadata = chunk.get("metadata", {})
        source = metadata.get("source", "unknown")
        page = metadata.get("page", "unknown")
        context_sections.append(
            f"Source {index}: {source} | Page {page}\n{chunk['text']}"
        )

    context_text = "\n\n---\n\n".join(context_sections)

    prompt = (
        f"{SYSTEM_PROMPT}\n\n"
        f"{history_text}"
        f"Document context:\n{context_text}\n\n"
        "Answer the user's question using only the document context. "
        "If the answer cannot be found in the document context, reply exactly: "
        "I can only answer based on the uploaded documents. "
        "Include a short source summary if you can.\n\n"
        f"User question: {question}\n"
    )

    return prompt
