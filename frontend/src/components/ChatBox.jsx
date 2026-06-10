import { useState, useRef, useEffect } from "react";
import { streamChat } from "../services/api";
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
  const [streamingMessage, setStreamingMessage] = useState("");

  const streamingRef = useRef("");
  const sourcesRef = useRef([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  const sendQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      content: question,
    };

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setQuestion("");
    setStreamingMessage("");
    streamingRef.current = "";
    sourcesRef.current = [];
 
    try {
      setLoading(true);

      await streamChat(
        question,
        currentMessages,
        (token) => {
          streamingRef.current += token;
          setStreamingMessage(streamingRef.current);
        },
        (sources) => {
          sourcesRef.current = sources;
        },
        () => {
          const aiMessage = {
            role: "assistant",
            content: streamingRef.current.trim() || "No response received.",
            sources: sourcesRef.current,
          };
          setMessages((prev) => [...prev, aiMessage]);
          streamingRef.current = "";
          sourcesRef.current = [];
          setStreamingMessage("");
        },
        (error) => {
          const errorMessage = {
            role: "assistant",
            content: `Error: ${error || "Unable to get response."}`,
            sources: [],
          };
          setMessages((prev) => [...prev, errorMessage]);
          streamingRef.current = "";
          sourcesRef.current = [];
          setStreamingMessage("");
        }
      );
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        role: "assistant",
        content: "Something went wrong. Please try again.",
        sources: [],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      sendQuestion();
    }
  };

  return (
    <div className="glass-card p-4 chat-panel">
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <p className="text-secondary mb-2 text-uppercase" style={{ letterSpacing: '0.2em', fontSize: '0.78rem' }}>
            Chat interface
          </p>
          <h3 className="section-heading mb-0">Ask questions in natural language</h3>
        </div>
        <div className="status-chip">
          {loading ? "Processing..." : "Ready to answer"}
        </div>
      </div>

      <div className="chat-body mb-4">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}

        {streamingMessage && (
          <div className="bubble bubble-ai bubble-typing">
            <div className="bubble-meta">Streaming response</div>
            <p className="bubble-text mb-0">{streamingMessage}<span className="text-white">▌</span></p>
          </div>
        )}

        {!streamingMessage && loading && (
          <div className="text-muted small">AI is thinking<span className="ms-2">...</span></div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="d-flex flex-column flex-md-row gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          className="form-control bg-secondary text-light border-0"
          disabled={loading}
        />
        <button
          type="button"
          onClick={sendQuestion}
          className="btn btn-accent px-4"
          disabled={loading || !question.trim()}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
