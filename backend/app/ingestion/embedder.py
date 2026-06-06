from sentence_transformers import SentenceTransformer

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

def create_embeddings(chunks):

    embeddings = []

    for chunk in chunks:
        vector = model.encode(chunk.page_content)
        embeddings.append(vector)

    return embeddings