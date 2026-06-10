from typing import Any, Dict, Iterable, List

try:
    from langchain_core.documents import Document
except ImportError:
    try:
        from langchain.schema import Document
    except ImportError:
        from dataclasses import dataclass

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