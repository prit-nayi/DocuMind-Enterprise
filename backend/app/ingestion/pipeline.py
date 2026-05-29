from app.ingestion.loader import load_pdf
from app.ingestion.cleaner import clean_text
from app.ingestion.chunker import split_chunks
from app.ingestion.embedder import create_embeddings
from app.ingestion.vector_store import store_in_chroma

def run_pipeline(file_path):

    print("Loading PDF...")

    documents = load_pdf(file_path)

    print("Cleaning text...")

    cleaned_docs = clean_text(documents)

    print("Chunking text...")

    chunks = split_chunks(cleaned_docs)

    print("Generating embeddings...")

    embeddings = create_embeddings(chunks)

    print("Storing vectors...")

    store_in_chroma(
        chunks,
        embeddings
    )

    print("Pipeline completed")