import { useState, useRef, useEffect } from "react";
import API from "../services/api";
import MessageBubble from "./MessageBubble";

const ChatBox = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! Upload a PDF and ask questions." },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    const currentQuestion = question;
    setQuestion("");

    try {
      setLoading(true);
      const response = await API.post("/chat", { question: currentQuestion });
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
        { role: "assistant", content: "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
    }
  };

  return (
    <div className="dm-chat-area">
      <div className="dm-chat-messages">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}

        {loading && (
          <div className="dm-msg-wrap dm-msg-ai">
            <div className="dm-msg-meta">DOCUMIND AI</div>
            <div className="dm-bubble-ai">
              <div className="dm-thinking">
                <div className="dm-dots">
                  <span></span><span></span><span></span>
                </div>
                Thinking...
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="dm-input-wrap">
        <div className="dm-input-row">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask a question about your document..."
            className="dm-textarea"
            rows={1}
          />
          <button
            onClick={sendQuestion}
            className="dm-btn-send"
            disabled={loading}
          >
            ➤
          </button>
        </div>
        <div className="dm-input-hint">
          <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
