import { useState } from "react";
import API from "../services/api";

const UploadPdf = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      const response = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAlert({ type: "success", msg: "✓ " + response.data.message });
    } catch (error) {
      console.error(error);
      setAlert({ type: "error", msg: "✗ Upload failed. Check backend." });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert(null), 4000);
    }
  };

  return (
    <div className="dm-section">
      <div className="dm-section-label">📎 Document Upload</div>
      <div className="dm-upload-card">
        <div className="dm-drop-zone">
          <div className="dm-drop-icon">📄</div>
          <div className="dm-drop-title">Drop PDF here</div>
          <div className="dm-drop-sub">or click to browse</div>
          <input
            type="file"
            accept="application/pdf"
            className="dm-file-input"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        {file && (
          <div className="dm-file-selected">
            📋 {file.name}
          </div>
        )}

        <button
          onClick={handleUpload}
          className="dm-btn-upload"
          disabled={!file || loading}
        >
          {loading ? "⏳ Uploading..." : "⬆ Upload PDF"}
        </button>

        {alert && (
          <div className={`dm-alert dm-alert-${alert.type}`}>
            {alert.msg}
          </div>
        )}
      </div>

      <div className="dm-section-label" style={{marginTop:"1.5rem"}}>⚙ System Info</div>
      <div className="dm-info-box">
        {[
          ["API", "localhost:8000"],
          ["Model", "llama3"],
          ["Vector DB", "ChromaDB"],
          ["Embedding", "MiniLM-L6"],
        ].map(([k, v]) => (
          <div className="dm-info-row" key={k}>
            <span className="dm-info-key">{k}</span>
            <span className="dm-info-val">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadPdf;
