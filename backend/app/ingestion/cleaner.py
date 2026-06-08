from dataclasses import dataclass
from typing import Any, Dict, Iterable, List

@dataclass
class Document:
    page_content: str
    metadata: Dict[str, Any]


def clean_text(documents: Iterable[Any]) -> List[Document]:
    cleaned = []

    for doc in documents:
        text = getattr(doc, "page_content", "").strip()
        metadata = dict(getattr(doc, "metadata", {}) or {})
        cleaned.append(Document(page_content=text, metadata=metadata))

    return cleaned