import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    llm_model: str = os.getenv("LLM_MODEL", "llama3")
    llm_base_url: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    hf_model: str = os.getenv(
    "HF_MODEL",
    "meta-llama/Llama-3.1-8B-Instruct"
)
    hf_provider: str = os.getenv(
    "HF_PROVIDER",
    "auto"
)
    huggingfacehub_api_token: str = os.getenv("HUGGINGFACEHUB_API_TOKEN", "")
    embedding_model: str = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    top_k_results: int = int(os.getenv("TOP_K_RESULTS", "5"))
    similarity_threshold: float = float(os.getenv("SIMILARITY_THRESHOLD", "0.7"))
    max_conversation_turns: int = int(os.getenv("MAX_CONVERSATION_TURNS", "10"))
    chroma_persist_dir: str = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")
    collection_name: str = os.getenv("COLLECTION_NAME", "documents")
    chunk_size: int = int(os.getenv("CHUNK_SIZE", "1000"))
    chunk_overlap: int = int(os.getenv("CHUNK_OVERLAP", "200"))

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="allow",
    )


settings = Settings()
