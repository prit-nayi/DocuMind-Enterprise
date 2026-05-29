import Navbar from "../components/Navbar";
import UploadPdf from "../components/UploadPdf";
import ChatBox from "../components/ChatBox";

const Home = () => {
  return (
    <div className="min-vh-100 bg-dark text-light">
      <Navbar />

      <div className="container py-4">
        <UploadPdf />

        <ChatBox />
      </div>
    </div>
  );
};

export default Home;