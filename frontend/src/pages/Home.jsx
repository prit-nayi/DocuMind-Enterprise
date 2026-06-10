import Navbar from "../components/Navbar";
import UploadPdf from "../components/UploadPdf";
import ChatBox from "../components/ChatBox";

const Home = () => {
  return (
    <div className="app-shell">
      <Navbar />
 
      <main className="main-container">
        <section className="hero-panel mb-5">
          <div className="d-flex flex-column gap-4">
            <div>
              <p className="text-uppercase text-secondary mb-3" style={{ letterSpacing: '0.28em', fontSize: '0.8rem' }}>
                Enterprise AI workspace
              </p>
              <h1>Modern PDF chat built for fast, confident answers.</h1>
              <p>
                Upload your documents, ask questions, and get contextual responses with source citations. Designed for teams that need a polished, responsive experience on desktop and mobile.
              </p>
            </div>

            <div className="feature-list">
              <span className="feature-pill">Smart document ingestion</span>
              <span className="feature-pill">Streaming AI responses</span>
              <span className="feature-pill">Source-aware citations</span>
            </div>
          </div>
        </section>

        <div className="page-grid">
          <UploadPdf />
          <ChatBox />
        </div>
      </main>
    </div>
  );
};

export default Home;
