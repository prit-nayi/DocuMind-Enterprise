from sentence_transformers import SentenceTransformer

from app.config import settings

model = SentenceTransformer(settings.embedding_model)

def create_embeddings(chunks):

    embeddings = []

    for chunk in chunks:
        vector = model.encode(chunk.page_content)
        embeddings.append(vector)

    return embeddings