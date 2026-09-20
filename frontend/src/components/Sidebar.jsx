import { useMemo, useState } from "react";
import { FileIcon, PlusIcon, SearchIcon } from "./Icons";

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const Sidebar = ({
  conversations = [],
  activeId,
  documents = [],
  onNew,
  onSelect,
  onUploadClick,
  isOpen,
  onClose,
}) => {
  const [search, setSearch] = useState("");

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return conversations;

    return conversations.filter(
      (conversation) =>
        conversation.title.toLowerCase().includes(query) ||
        conversation.messages.some((message) =>
          message.content.toLowerCase().includes(query)
        )
    );
  }, [conversations, search]);

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`app-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-header-row">
            <h2>
              Chat History{" "}
              <span className="sidebar-count">
                ({String(conversations.length).padStart(2, "0")})
              </span>
            </h2>
            <div className="sidebar-icon-group">
              <button
                type="button"
                className="sidebar-icon-btn"
                onClick={onNew}
                aria-label="New chat"
              >
                <PlusIcon />
              </button>
            </div>
          </div>

          <div className="sidebar-search">
            <SearchIcon />
            <input
              type="search"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Recent Chats</div>
          <div className="conv-list">
            {filteredConversations.length === 0 ? (
              <p className="sidebar-empty">No conversations found.</p>
            ) : (
              filteredConversations.map((conversation) => {
                const lastMessage =
                  conversation.messages[conversation.messages.length - 1];
                return (
                  <div
                    key={conversation.id}
                    className={`conv-item ${conversation.id === activeId ? "active" : ""}`}
                    onClick={() => {
                      onSelect(conversation.id);
                      onClose?.();
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onSelect(conversation.id);
                        onClose?.();
                      }
                    }}
                  >
                    <div className="conv-item-header">
                      <span className="conv-title">{conversation.title}</span>
                      <span className="conv-time">
                        {formatTime(conversation.updatedAt)}
                      </span>
                    </div>
                    <div className="conv-preview">
                      {lastMessage?.content?.slice(0, 72) || "No messages yet"}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="sidebar-section" style={{ flex: "0 0 auto", paddingTop: 0 }}>
          <div className="sidebar-section-label">Documents</div>
          {documents.length === 0 ? (
            <p className="sidebar-empty">No PDFs uploaded yet.</p>
          ) : (
            <div className="doc-list">
              {documents.map((doc) => (
                <div key={doc.id} className="doc-item">
                  <div className="doc-item-icon">
                    <FileIcon />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="doc-item-name">{doc.name}</div>
                    <div className="doc-item-meta">{doc.sizeLabel}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <button type="button" className="btn-new-chat" onClick={onUploadClick}>
            <PlusIcon />
            Upload PDF
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
