const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className="mb-3 d-flex flex-column">
      <div
        className={isUser ? "user-message" : "ai-message"}
        style={{
          marginLeft: isUser ? "auto" : "0",
          marginRight: isUser ? "0" : "auto",
          maxWidth: "80%",
        }}
      >
        <p style={{ marginBottom: "0.5rem", lineHeight: "1.5" }}>
          {message.content}
        </p>

        {message.sources && message.sources.length > 0 && (
          <div 
            className="mt-3 small text-light"
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.2)",
              paddingTop: "0.75rem",
              marginTop: "0.75rem",
            }}
          >
            <p 
              style={{
                fontWeight: "600",
                marginBottom: "0.5rem",
                fontSize: "0.85rem",
                textTransform: "uppercase",
                opacity: 0.8,
              }}
            >
              📄 Sources:
            </p>

            {message.sources.map((source, index) => (
              <div 
                key={index}
                style={{
                  padding: "0.4rem 0",
                  borderLeft: "2px solid rgba(255, 255, 255, 0.3)",
                  paddingLeft: "0.5rem",
                  marginBottom: "0.4rem",
                }}
              >
                <span style={{ fontWeight: "500" }}>
                  {source.document || "Unknown Document"}
                </span>
                {source.page && (
                  <span style={{ opacity: 0.8, marginLeft: "0.5rem" }}>
                    - Page {source.page}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .user-message {
          background-color: #0d6efd;
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          margin-bottom: 0.5rem;
          word-wrap: break-word;
        }

        .ai-message {
          background-color: #495057;
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          margin-bottom: 0.5rem;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
};

export default MessageBubble;
