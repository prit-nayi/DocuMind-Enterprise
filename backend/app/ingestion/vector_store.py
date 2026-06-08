import chromadb

from app.config import settings

client = chromadb.PersistentClient(
    path=settings.chroma_persist_dir
)

collection = client.get_or_create_collection(
    name=settings.collection_name
)

def store_in_chroma(
    chunks,
    embeddings
):

    for index, chunk in enumerate(chunks):
        metadata = dict(chunk.metadata or {})
        chunk_id = metadata.get("chunk_id", str(index))

        collection.add(
            documents=[chunk.page_content],
            embeddings=[embeddings[index].tolist()],
            metadatas=[metadata],
            ids=[chunk_id]
        )
