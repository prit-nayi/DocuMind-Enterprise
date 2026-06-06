import chromadb

client = chromadb.PersistentClient(
    path="chroma_db"
)

collection = client.get_or_create_collection(
    name="documents"
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