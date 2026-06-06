from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader

def load_pdf(file_path):

    loader = PyPDFLoader(file_path)

    documents = loader.load()

    source_name = Path(file_path).name
    for document in documents:
        document.metadata.setdefault("source", source_name)

    return documents