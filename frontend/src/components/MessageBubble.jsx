import { FileIcon } from "./Icons";

const MessageBubble = ({ message, isStreaming = false }) => {
  const isUser = message.role === "user";

  return (
    <div className={`message-row ${isUser ? "user" : "assistant"}`}>
      <div
        className={`message-bubble ${isUser ? "user" : "assistant"} ${isStreaming ? "streaming" : ""}`}
      >
        {!isUser && (
          <div className="message-label">
            <FileIcon />
            DocuMind AI
          </div>
        )}

        <p className="message-text">
          {message.content}
          {isStreaming && <span className="stream-cursor" />}
        </p>

        {message.sources && message.sources.length > 0 && (
          <div className="message-sources">
            <div className="message-sources-label">Sources</div>
            <div className="source-chips">
              {message.sources.map((source, index) => (
                <span key={index} className="source-chip">
                  <FileIcon />
                  {source.document || "Unknown"}
                  {source.page != null && source.page !== "" && (
                    <span>· p.{source.page}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
