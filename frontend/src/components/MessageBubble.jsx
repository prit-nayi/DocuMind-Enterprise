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