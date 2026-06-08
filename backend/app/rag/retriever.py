import chromadb
from sentence_transformers import SentenceTransformer

from app.config import settings

model = SentenceTransformer(settings.embedding_model)

client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
collection = client.get_or_create_collection(name=settings.collection_name)


def _build_query_text(question, history=None):
    if not history:
        return question

    history_lines = []
    for turn in history[-settings.max_conversation_turns:]:
        role = turn.get("role", "user").capitalize()
        content = turn.get("content", "")
        history_lines.append(f"{role}: {content}")

    return "\n".join(history_lines) + "\nCurrent question: " + question


def retrieve_chunks(question, history=None):
    query_text = _build_query_text(question, history)
    query_embedding = model.encode(query_text)

    results = collection.query(
        query_embeddings=[query_embedding.tolist()],
        n_results=settings.top_k_results,
        include=["documents", "metadatas", "distances"],
    )

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    chunks = []
    for document, metadata, distance in zip(documents, metadatas, distances):
        chunks.append({
            "text": document,
            "metadata": metadata or {},
            "distance": distance,
        })

    return chunks