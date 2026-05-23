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