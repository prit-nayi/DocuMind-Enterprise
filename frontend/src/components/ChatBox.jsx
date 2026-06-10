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
  const [streamingSources, setStreamingSources] = useState([]);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  const streamingRef = useRef("");
  const sourcesRef = useRef([]);

  const sendQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      content: question,
    };

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    const currentQuestion = question;
    setQuestion("");
    setStreamingMessage("");
    setStreamingSources([]);
    streamingRef.current = "";
    sourcesRef.current = [];

    try {
      setLoading(true);

      // Use streaming API for real-time token delivery
      await streamChat(
        currentQuestion,
        currentMessages,
        // onToken callback - add each token to streaming message
        (token) => {
          streamingRef.current += token;
          setStreamingMessage(streamingRef.current);
        },
        // onSources callback - update sources when received
        (sources) => {
          sourcesRef.current = sources;
          setStreamingSources(sources);
        },
        // onComplete callback - finalize the message
        () => {
          const finalContent = streamingRef.current.trim();
          if (finalContent) {
            const aiMessage = {
              role: "assistant",
              content: finalContent,
              sources: sourcesRef.current,
            };
            setMessages((prev) => [...prev, aiMessage]);
          }
          streamingRef.current = "";
          sourcesRef.current = [];
          setStreamingMessage("");
          setStreamingSources([]);
        },
        // onError callback - handle errors
        (error) => {
          const errorMessage = {
            role: "assistant",
            content: `Error: ${error || "Failed to get response"}`,
            sources: [],
          };
          setMessages((prev) => [...prev, errorMessage]);
          streamingRef.current = "";
          sourcesRef.current = [];
          setStreamingMessage("");
          setStreamingSources([]);
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

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      sendQuestion();
    }
  };

  return (
    <div className="card bg-dark text-light p-4">
      <div className="chat-container mb-4" style={{ maxHeight: "500px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            message={msg}
          />
        ))}

        {/* Streaming message display with typewriter effect */}
        {streamingMessage && (
          <div className="d-flex justify-content-start mb-3">
            <div 
              className="bg-secondary text-light p-3 rounded"
              style={{ maxWidth: "80%", wordWrap: "break-word" }}
            >
              {/* Typewriter effect: show text with cursor */}
              <span>{streamingMessage}</span>
              <span 
                className="ms-1" 
                style={{
                  display: "inline-block",
                  width: "8px",
                  height: "1.2em",
                  backgroundColor: "white",
                  animation: "blink 0.7s infinite",
                  marginLeft: "2px",
                }}
              />
            </div>
          </div>
        )}

        {loading && !streamingMessage && (
          <div className="text-secondary">
            <span>AI is thinking</span>
            <span 
              className="ms-2" 
              style={{
                display: "inline-block",
                animation: "blink 0.7s infinite",
              }}
            >
              ...
            </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="d-flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question..."
          className="form-control bg-secondary text-light border-0"
          disabled={loading}
        />

        <button
          onClick={sendQuestion}
          className="btn btn-success px-4"
          disabled={loading || !question.trim()}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>

      {/* CSS for blinking cursor animation */}
      <style>{`
        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
        
        .chat-container {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
        
        .chat-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .chat-container::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .chat-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        
        .chat-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default ChatBox;
