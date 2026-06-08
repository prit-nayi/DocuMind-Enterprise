from app.config import settings
# from langchain.schema import Document
from langchain_text_splitters import (
    RecursiveCharacterTextSplitter
)


def split_chunks(cleaned_docs):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap
    )

    chunks = splitter.create_documents(cleaned_docs)

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