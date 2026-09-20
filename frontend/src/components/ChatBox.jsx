import { useEffect, useRef, useState } from "react";
import { streamChat } from "../services/api";
import MessageBubble from "./MessageBubble";
import UploadPdf from "./UploadPdf";
import {
  AttachIcon,
  LogoIcon,
  SearchDocIcon,
  SendIcon,
  SummaryIcon,
  UploadIcon,
} from "./Icons";

const QUICK_ACTIONS = [
  {
    id: "summarize",
    title: "Summarize Document",
    description: "Get a concise overview of your uploaded PDF",
    icon: SummaryIcon,
    prompt: "Summarize the key points from the uploaded document.",
  },
  {
    id: "search",
    title: "Find Information",
    description: "Search for specific details inside your documents",
    icon: SearchDocIcon,
    prompt: "What are the most important details in this document?",
  },
  {
    id: "upload",
    title: "Upload New PDF",
    description: "Add a document to start asking questions",
    icon: UploadIcon,
    action: "upload",
  },
];

const CATEGORY_CHIPS = [
  { id: "all", label: "All" },
  { id: "summary", label: "Summary", prompt: "Provide a brief summary of the document." },
  { id: "search", label: "Search", prompt: "What topics does this document cover?" },
  { id: "analysis", label: "Analysis", prompt: "Analyze the main themes and recommendations in the document." },
];

const isWelcomeState = (messages) => {
  if (!messages || messages.length <= 1) return true;
  return messages.length === 1 && messages[0].role === "assistant";
};

const ChatBox = ({
  messages = [],
  conversationTitle = "New Chat",
  onAppendMessage = () => {},
  onUpdateTitle = () => {},
  onUploadClick,
  fileInputRef,
  onUploadComplete,
  onUploadStatus,
  uploadStatus,
}) => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [streamingSources, setStreamingSources] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const chatEndRef = useRef(null);
  const streamingRef = useRef("");
  const sourcesRef = useRef([]);

  const showWelcome = isWelcomeState(messages) && !streamingMessage && !loading;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage, loading]);

  const submitQuestion = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: "user", content: trimmed };
    onAppendMessage(userMessage);

    const isFirstUserMessage = messages.filter((m) => m.role === "user").length === 0;
    if (isFirstUserMessage) {
      onUpdateTitle(trimmed.slice(0, 48) + (trimmed.length > 48 ? "..." : ""));
    }

    setQuestion("");
    setStreamingMessage("");
    setStreamingSources([]);
    streamingRef.current = "";
    sourcesRef.current = [];

    try {
      setLoading(true);

      await streamChat(
        trimmed,
        [...messages, userMessage],
        (token) => {
          streamingRef.current += token;
          setStreamingMessage(streamingRef.current);
        },
        (sources) => {
          sourcesRef.current = sources;
          setStreamingSources(sources);
        },
        () => {
          const finalContent = streamingRef.current.trim();
          if (finalContent) {
            onAppendMessage({
              role: "assistant",
              content: finalContent,
              sources: sourcesRef.current,
            });
          }
          streamingRef.current = "";
          sourcesRef.current = [];
          setStreamingMessage("");
          setStreamingSources([]);
        },
        (error) => {
          onAppendMessage({
            role: "assistant",
            content: `Error: ${error || "Failed to get response"}`,
            sources: [],
          });
          streamingRef.current = "";
          sourcesRef.current = [];
          setStreamingMessage("");
          setStreamingSources([]);
        }
      );
    } catch (error) {
      console.error("Chat error:", error);
      onAppendMessage({
        role: "assistant",
        content: "Something went wrong. Please try again.",
        sources: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    if (action.action === "upload") {
      onUploadClick?.();
      return;
    }
    if (action.prompt) {
      submitQuestion(action.prompt);
    }
  };

  const handleCategoryClick = (chip) => {
    setActiveCategory(chip.id);
    if (chip.prompt) {
      submitQuestion(chip.prompt);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitQuestion(question);
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-main-header">
        <span className="chat-main-title">{conversationTitle}</span>
        <span className="chat-main-status">
          <span className="live-dot" />
          Document Q&amp;A
        </span>
      </div>

      {showWelcome ? (
        <div className="welcome-screen">
          <div className="welcome-icon">
            <LogoIcon />
          </div>
          <h1>How can I help with your documents?</h1>
          <p>
            Upload a PDF, ask questions, and get accurate answers with source
            citations — powered by your enterprise RAG pipeline.
          </p>

          <div className="quick-actions">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  type="button"
                  className="quick-action-card"
                  onClick={() => handleQuickAction(action)}
                >
                  <div className="quick-action-icon">
                    <Icon />
                  </div>
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </button>
              );
            })}
          </div>

          <div className="category-chips">
            {CATEGORY_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                className={`category-chip ${activeCategory === chip.id ? "active" : ""}`}
                onClick={() => handleCategoryClick(chip)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}

          {streamingMessage && (
            <MessageBubble
              message={{ role: "assistant", content: streamingMessage, sources: streamingSources }}
              isStreaming
            />
          )}

          {loading && !streamingMessage && (
            <div className="thinking-indicator">
              <div className="thinking-dots">
                <span />
                <span />
                <span />
              </div>
              Analyzing your documents...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      )}

      <div className="chat-input-area">
        {uploadStatus && (
          <div className={`upload-toast ${uploadStatus.type}`}>
            {uploadStatus.message}
          </div>
        )}

        <div className="chat-input-wrapper">
          <button
            type="button"
            className="chat-attach-btn"
            onClick={onUploadClick}
            aria-label="Upload PDF"
            disabled={loading}
          >
            <AttachIcon />
          </button>

          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your documents..."
            disabled={loading}
          />

          <button
            type="button"
            className="chat-send-btn"
            onClick={() => submitQuestion(question)}
            disabled={loading || !question.trim()}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>

      <UploadPdf
        fileInputRef={fileInputRef}
        onUploadComplete={onUploadComplete}
        onUploadStatus={onUploadStatus}
      />
    </div>
  );
};

export default ChatBox;
