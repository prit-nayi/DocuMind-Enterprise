const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`bubble-wrapper ${isUser ? "justify-content-end" : "justify-content-start"}`}>
      <div className={`bubble ${isUser ? "bubble-user" : "bubble-ai"}`}>
        <div className="bubble-meta">
          {isUser ? "You" : "DocuMind AI"}
        </div>
 
        <p className="bubble-text">
          {message.content}
        </p>

        {message.sources && message.sources.length > 0 && (
          <div className="bubble-sources">
            <div className="bubble-meta">📄 Sources</div>
            {message.sources.map((source, index) => (
              <div key={index} className="source-item">
                <span>{source.document || "Unknown document"}</span>
                {source.page && (
                  <span className="source-meta">Page {source.page}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
