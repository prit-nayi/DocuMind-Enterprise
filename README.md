# React Frontend for Enterprise RAG SOP Assistant

This frontend will:

* Upload PDFs
* Send chat questions to backend
* Display AI answers
* Show citations
* Maintain chat history
* Connect with FastAPI backend

---

# Frontend Folder Structure

```bash
frontend/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── ChatBox.jsx
│   │   ├── MessageBubble.jsx
│   │   ├── UploadPdf.jsx
│   │   └── Navbar.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── pages/
│   │   └── Home.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
└── vite.config.js
```

---

# STEP 1 — CREATE REACT PROJECT

Run:

```bash
npx create-react-app frontend
```

Then:

```bash
cd frontend
npm install
```

Install Bootstrap:

```bash
npm install bootstrap axios
```

This project now uses:

* React
* Bootstrap CSS
* Normal CSS
* Axios

No Tailwind CSS is used.

````

---

# STEP 2 — IMPORT BOOTSTRAP

# src/index.js

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
````

---

# STEP 3 — NORMAL CSS

# src/index.css

```css
body {
  margin: 0;
  padding: 0;
  background-color: #111827;
  color: white;
  font-family: Arial, sans-serif;
}

.chat-container {
  height: 600px;
  overflow-y: auto;
}

.user-message {
  background-color: #0d6efd;
  color: white;
  padding: 12px;
  border-radius: 15px;
  max-width: 70%;
  margin-left: auto;
}

.ai-message {
  background-color: #374151;
  color: white;
  padding: 12px;
  border-radius: 15px;
  max-width: 70%;
}
```

---

# src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  padding: 0;
  background-color: #111827;
  color: white;
  font-family: Arial, sans-serif;
}
```

---

# STEP 4 — API SERVICE

# src/services/api.js

```javascript
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export default API;
```

---

# STEP 4 — NAVBAR COMPONENT

# src/components/Navbar.jsx

```javascript
const Navbar = () => {
  return (
    <div className="bg-dark p-3 border-bottom border-secondary">
      <h1 className="text-center fw-bold text-light">
        DocuMind Enterprise AI
      </h1>
    </div>
  );
};

export default Navbar;
```

---

# STEP 5 — PDF UPLOAD COMPONENT

# src/components/UploadPdf.jsx

```javascript
import { useState } from "react";
import API from "../services/api";

const UploadPdf = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await API.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-dark text-light p-4 mb-4">
      <h2 className="h5 mb-3">
        Upload PDF
      </h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="form-control mb-3"
      />

      <button
        onClick={handleUpload}
        className="btn btn-primary"
      >
        {loading ? "Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
};

export default UploadPdf;
```

---

# STEP 6 — MESSAGE BUBBLE

# src/components/MessageBubble.jsx

```javascript
const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className="mb-3 d-flex flex-column"
    >
      <div
        className={isUser ? "user-message" : "ai-message"}
      >
        <p>{message.content}</p>

        {message.sources && (
          <div className="mt-3 small text-light">
            <p className="font-bold">Sources:</p>

            {message.sources.map((source, index) => (
              <div key={index}>
                {source.document} - Page {source.page}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
```

---

# STEP 7 — CHATBOX COMPONENT

# src/components/ChatBox.jsx

```javascript
import { useState } from "react";
import API from "../services/api";
import MessageBubble from "./MessageBubble";

const ChatBox = () => {
  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! Upload a PDF and ask questions.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const sendQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentQuestion = question;

    setQuestion("");

    try {
      setLoading(true);

      const response = await API.post("/chat", {
        question: currentQuestion,
      });

      const aiMessage = {
        role: "assistant",
        content: response.data.answer,
        sources: response.data.sources,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-dark text-light p-4">
      <div className="chat-container mb-4">
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            message={msg}
          />
        ))}

        {loading && (
          <div className="text-secondary">
            AI is thinking...
          </div>
        )}
      </div>

      <div className="d-flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="form-control bg-secondary text-light border-0"
        />

        <button
          onClick={sendQuestion}
          className="btn btn-success px-4"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
```

---

# STEP 8 — HOME PAGE

# src/pages/Home.jsx

```javascript
import Navbar from "../components/Navbar";
import UploadPdf from "../components/UploadPdf";
import ChatBox from "../components/ChatBox";

const Home = () => {
  return (
    <div className="min-vh-100 bg-dark text-light">
      <Navbar />

      <div className="container py-4">
        <UploadPdf />

        <ChatBox />
      </div>
    </div>
  );
};

export default Home;
```

---

# STEP 9 — APP.jsx

# src/App.jsx

```javascript
import Home from "./pages/Home";

function App() {
  return <Home />;
}

export default App;
```

---

# HOW THIS FRONTEND WORKS

# FLOW 1 — PDF Upload

```text
User uploads PDF
↓
UploadPdf.jsx
↓
POST /upload
↓
FastAPI backend
↓
Ingestion pipeline runs
↓
PDF stored in vector DB
```

---

# FLOW 2 — Chat Question

```text
User asks question
↓
ChatBox.jsx
↓
POST /chat
↓
FastAPI backend
↓
Retriever searches chunks
↓
LLM generates answer
↓
Frontend receives answer
↓
MessageBubble displays response
```

---

# EXPECTED BACKEND RESPONSE

# /chat response

```json
{
  "answer": "Employees can claim reimbursement within 7 days.",
  "sources": [
    {
      "document": "employee_policy.pdf",
      "page": 14
    }
  ]
}
```

---

# RUN FRONTEND

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# RUN BACKEND

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```bash
http://localhost:8000
```

---

# IMPORTANT NEXT STEP

Your next backend tasks:

1. Create /upload API
2. Create ingestion pipeline
3. Create /chat API
4. Connect ChromaDB
5. Connect Ollama
6. Add streaming response
7. Add memory
8. Add authentication later

---

# FUTURE IMPROVEMENTS

Later you can add:

* Dark/light mode
* Streaming text
* Markdown rendering
* PDF preview
* Multiple chats
* Authentication
* Chat history
* Admin dashboard
* Voice input
* Typing animation
* Token streaming
* Conversation memory
=======
# DocuMind-Enterprise
An AI-powered RAG system designed for corporate SOPs. Features parent-document retrieval, source-cited answers, and strict anti-hallucination guardrails to ensure 100% factual accuracy from internal documentation.
>>>>>>> b9318b8d92adc4e7ab4a937bfa6a547d6e77f538
