import { useState } from "react";
import API from "../services/api";

const UploadPdf = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.message);
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card upload-panel" style={{ padding: '2.5rem' }}>
      <div className="panel-header">
        <div>
          <h3 className="panel-title">📄 Upload Document</h3>
          <p className="panel-subtitle">Add your PDF to start asking questions</p>
        </div>
        <span className="status-chip">PDF Files</span>
      </div>

      <div className="file-input-wrapper">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '2rem 1.5rem',
          }}
        />
      </div>

      {file && (
        <div className="upload-file-info">
          ✅ {file.name} ({(file.size / 1024).toFixed(1)} KB)
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        className="btn-accent"
        disabled={loading || !file}
        style={{ width: '100%', marginTop: file ? '0.5rem' : '1.5rem' }}
      >
        {loading ? "⏳ Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
};

export default UploadPdf;
