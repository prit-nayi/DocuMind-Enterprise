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

        collection.add(
            documents=[chunk.page_content],
            embeddings=[embeddings[index].tolist()],
            ids=[str(index)]
        )