from langchain.schema import Document

def clean_text(documents):

    cleaned = []

    for doc in documents:

        text = doc.page_content.strip()
        metadata = dict(doc.metadata or {})

        cleaned.append(Document(page_content=text, metadata=metadata))

    return cleaned