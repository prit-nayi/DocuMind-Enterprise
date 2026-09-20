import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "Welcome to DocuMind Enterprise! Upload a PDF and ask questions — I'll answer using your documents with source citations.",
};

const createConversation = (id = Date.now()) => ({
  id,
  title: "New Chat",
  updatedAt: Date.now(),
  messages: [WELCOME_MESSAGE],
});

const Home = () => {
  const fileInputRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [conversations, setConversations] = useState([createConversation(1)]);
  const [activeId, setActiveId] = useState(1);

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ||
    conversations[0];

  const appendMessageToActive = (message) => {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === activeId
          ? {
              ...conversation,
              updatedAt: Date.now(),
              messages: [...conversation.messages, message],
            }
          : conversation
      )
    );
  };

  const updateActiveTitle = (title) => {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === activeId ? { ...conversation, title } : conversation
      )
    );
  };

  const createNewConversation = () => {
    const conversation = createConversation();
    setConversations((prev) => [conversation, ...prev]);
    setActiveId(conversation.id);
    setSidebarOpen(false);
  };

  const selectConversation = (id) => {
    setActiveId(id);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleUploadComplete = (document) => {
    setDocuments((prev) => [document, ...prev]);
  };

  const handleUploadStatus = (status) => {
    setUploadStatus(status);
    if (status.type === "success" || status.type === "error") {
      setTimeout(() => setUploadStatus(null), 4000);
    }
  };

  return (
    <div className="app-layout">
      <Navbar onMenuToggle={() => setSidebarOpen((open) => !open)} />

      <div className="app-body">
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          documents={documents}
          onNew={createNewConversation}
          onSelect={selectConversation}
          onUploadClick={triggerUpload}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="chat-main">
          <ChatBox
            messages={activeConversation.messages}
            conversationTitle={activeConversation.title}
            onAppendMessage={appendMessageToActive}
            onUpdateTitle={updateActiveTitle}
            onUploadClick={triggerUpload}
            fileInputRef={fileInputRef}
            onUploadComplete={handleUploadComplete}
            onUploadStatus={handleUploadStatus}
            uploadStatus={uploadStatus}
          />
        </main>
      </div>
    </div>
  );
};

export default Home;
