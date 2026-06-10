from typing import Any, Dict

from app.config import settings

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

try:
    from langchain_text_splitters import (
        RecursiveCharacterTextSplitter
    )
except Exception:
    RecursiveCharacterTextSplitter = None


def split_chunks(cleaned_docs):

    if RecursiveCharacterTextSplitter is None:
        raise RuntimeError(
            "Missing dependency: langchain_text_splitters. Install it to use chunking."
        )

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap
    )

    chunks = splitter.split_documents(cleaned_docs)

    updated_chunks = []
    for index, chunk in enumerate(chunks):
        metadata = dict(chunk.metadata or {})
        source = metadata.get("source", "unknown")
        metadata["chunk_id"] = f"{source}_{index}"
        metadata.setdefault("source", source)
        metadata.setdefault("page", metadata.get("page", None))

        updated_chunks.append(Document(
            page_content=chunk.page_content,
            metadata=metadata
        ))

    return updated_chunks