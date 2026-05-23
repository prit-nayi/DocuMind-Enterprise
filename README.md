# DocuMind Enterprise - AI-Powered SOP Assistant

An enterprise-grade Retrieval Augmented Generation (RAG) application for internal corporate knowledge management. DocuMind Enterprise ingests corporate PDF documents and provides intelligent, context-grounded answers directly from your documentation.

## Overview

DocuMind Enterprise is an AI-powered SOP Assistant designed to:
- **Ingest** corporate PDF documents securely
- **Parse & Clean** text with intelligent preprocessing
- **Chunk** documents strategically for optimal retrieval
- **Generate** semantic embeddings for all chunks
- **Store** embeddings in vector databases
- **Retrieve** relevant context using semantic search
- **Answer** user questions ONLY from retrieved document context
- **Cite** sources with page numbers and document references
- **Refuse** hallucinated or out-of-context answers
- **Stream** responses in real-time
- **Remember** conversation history for context-aware responses

**Key Principle:** This system acts as an enterprise-safe AI that answers strictly from uploaded documents and refuses external/general knowledge questions.

---

## Tech Stack

### Frontend
- **React/Next.js** - Modern UI framework
- **Real-time Streaming Chat UI** - ChatGPT-like experience
- **Citation Display** - Show sources and page numbers

### Backend
- **Python 3.11+** - Core language
- **FastAPI** - High-performance async API
- **Async endpoints** - Non-blocking request handling
- **Streaming responses** - Token-by-token response delivery

### RAG & AI Core
- **LangChain** - Orchestrate RAG pipeline
- **HuggingFace Embeddings** - Generate semantic embeddings
- **ChromaDB** - Local vector database (default)
- **Pinecone** - Cloud vector database (optional upgrade)
- **Ollama** - Run local LLMs
- **Models:** Mistral or Llama3 - Open-source LLMs

### Document Processing
- **Unstructured.io / PyPDF** - PDF parsing
- **Recursive Chunking** - Intelligent text splitting
- **Metadata Extraction** - Preserve document structure
- **Source Tracking** - Link answers to source documents

### Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Environment Variables** - Configuration management

---

## Core Features

### 1. Document Ingestion Pipeline
- Upload PDF documents via REST API
- Automatic text extraction and cleaning
- Recursive chunking with overlap for context preservation
- Metadata extraction (title, author, page numbers)
- Batch processing support

### 2. Semantic Retrieval
- Vector similarity search
- Context-aware retrieval using conversation history
- Configurable retrieval parameters (top-k results, similarity threshold)
- Source document tracking

### 3. Response Generation
- Grounded responses from retrieved context only
- Automatic refusal for out-of-context questions
- Source citations with page numbers
- Conversation memory for follow-up questions

### 4. Streaming Responses
- Token-by-token response streaming
- Real-time frontend UI updates
- ChatGPT-like user experience

### 5. Safety & Governance
- Strictly grounded answers (no hallucinations)
- Explicit refusal for unanswerable questions
- Source citation for transparency
- Audit trail of queries and responses

---

## Project Architecture

### Folder Structure
```
documind-enterprise/
├── backend/
│   ├── ingestion/          # PDF parsing & chunking
│   ├── rag/               # RAG pipeline & retrieval
│   ├── api/               # FastAPI endpoints
│   ├── prompts/           # LLM system prompts
│   ├── services/          # Business logic services
│   ├── utils/             # Helper functions
│   ├── config.py          # Configuration management
│   ├── main.py            # FastAPI app entry point
│   └── requirements.txt    # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── styles/        # Tailwind CSS
│   │   └── utils/         # Frontend utilities
│   ├── package.json
│   └── tailwind.config.js
│
├── docker-compose.yml     # Multi-container setup
├── Dockerfile             # Backend container
└── README.md             # This file
```

### Data Flow Architecture
```
User Query
    ↓
[FastAPI Endpoint] → Validate Input
    ↓
[Retrieval Service] → Vector Search (ChromaDB)
    ↓
[Retrieved Context] → Top K Similar Chunks
    ↓
[LLM Service] → Generate Answer from Context
    ↓
[Streaming Handler] → Token-by-Token Stream
    ↓
[Frontend UI] → Display Response + Citations
```

---

## Key Design Decisions

### Why ChromaDB?
- Lightweight, serverless vector database
- Perfect for initial development and small deployments
- Python-native with easy integration
- No infrastructure overhead
- Pinecone as upgrade path for scale

### Why FastAPI?
- Async by default (non-blocking I/O)
- Automatic OpenAPI documentation
- Built-in streaming support
- High performance with minimal boilerplate
- Ideal for real-time LLM applications

### Why LangChain?
- Standardized RAG pipeline components
- Abstraction over multiple LLMs and embeddings
- Built-in prompt management
- Memory and conversation support
- Reduces boilerplate code

### Why Streaming?
- Better user experience (no long waits)
- Token-by-token rendering matches ChatGPT
- Reduced latency perception
- More interactive feel

---

## Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose (optional)
- 8GB+ RAM (for local LLMs)

### Quick Start

#### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### 3. Run with Docker Compose
```bash
docker-compose up --build
```

---

## API Endpoints

### Document Ingestion
- `POST /api/documents/upload` - Upload PDF document
- `GET /api/documents/` - List uploaded documents
- `DELETE /api/documents/{doc_id}` - Delete document

### Query & Chat
- `POST /api/query` - Submit question (returns streaming response)
- `POST /api/chat` - Chat endpoint with conversation memory
- `GET /api/chat/history/{session_id}` - Get conversation history

### Retrieval (Debug)
- `POST /api/retrieve` - Test retrieval pipeline
- `GET /api/embeddings/status` - Check vector DB status

---

## Development Roadmap

### Phase 1: Foundation
- [ ] Backend architecture setup
- [ ] FastAPI endpoints structure
- [ ] Document ingestion pipeline
- [ ] Vector database integration

### Phase 2: Core RAG
- [ ] Retrieval pipeline implementation
- [ ] LLM integration (Ollama + Mistral/Llama3)
- [ ] Response generation with citations
- [ ] Context grounding & safety checks

### Phase 3: Frontend & UX
- [ ] React chat interface
- [ ] Streaming response renderer
- [ ] Citation display component
- [ ] Document upload UI

### Phase 4: Production Ready
- [ ] Conversation memory
- [ ] Docker containerization
- [ ] Error handling & logging
- [ ] Performance optimization

### Phase 5: Advanced Features (Optional)
- [ ] Hybrid retrieval (keyword + semantic)
- [ ] Parent document retrieval
- [ ] Pinecone integration
- [ ] Multi-document reasoning

---

## Safety & Governance

### Core Safety Principles
1. **No Hallucinations** - Answer only from retrieved context
2. **Explicit Refusal** - Refuse unanswerable questions clearly
3. **Source Citations** - Always show where answers come from
4. **Context Limitation** - Reject questions outside document scope

### Example Response Patterns
```
✅ GOOD: "According to page 3 of the SOP document: [answer]"
✅ GOOD: "This information is not available in the uploaded documents."
❌ BAD: "Based on general knowledge, [hallucinated answer]"
```

---

## Deployment Strategy

### Local Development
- Run backend & frontend locally
- ChromaDB stores vectors locally
- Ollama runs on local machine

### Docker Deployment
- Backend: Python FastAPI container
- Frontend: Node.js / Next.js container
- ChromaDB: Persistent volume
- Network: Docker network for service communication

### Production Upgrade Path
1. Replace ChromaDB with Pinecone
2. Use hosted LLMs (OpenAI, Anthropic)
3. Add authentication & authorization
4. Implement audit logging
5. Deploy on Kubernetes (optional)

---

## Contributing Guidelines

### Code Standards
- **Modularity** - Single responsibility principle
- **Readability** - Self-documenting code with comments
- **Error Handling** - Graceful failure with meaningful errors
- **Testing** - Unit tests for critical components
- **Documentation** - Docstrings for all functions

### Development Workflow
1. Feature branches (`git checkout -b feature/name`)
2. Small, focused commits
3. Pull request review process
4. Test before merge

---

## Learning Resources

- [LangChain Documentation](https://python.langchain.com/)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/)
- [ChromaDB Guide](https://docs.trychroma.com/)
- [RAG Papers & Research](https://arxiv.org/)

---

## License

[Add your license here]

## Support

For questions or issues, contact the development team.

---

**Built by a collaborative team of developers. Enterprise-grade. Production-ready. Beginner-friendly.**