import Navbar from "../components/Navbar";
import UploadPdf from "../components/UploadPdf";
import ChatBox from "../components/ChatBox";

const Home = () => {
  return (
    <div className="dm-app">
      <Navbar />
      <div className="dm-layout">
        <aside className="dm-sidebar">
          <UploadPdf />
        </aside>
        <ChatBox />
      </div>
    </div>
  );
};

export default Home;
