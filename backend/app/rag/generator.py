def generate_answer(
    question,
    chunks
):

    context = \"\\n\".join(chunks)

    answer = f\"Answer generated from context:\\n\\n{context[:500]}\"

    return answer