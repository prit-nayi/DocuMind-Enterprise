def clean_text(documents):

    cleaned = []

    for doc in documents:

        text = doc.page_content.strip()

        cleaned.append(text)

    return cleaned