from langchain.text_splitter import (
    RecursiveCharacterTextSplitter
)

def split_chunks(cleaned_docs):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )

    chunks = splitter.create_documents(
        cleaned_docs
    )

    return chunks