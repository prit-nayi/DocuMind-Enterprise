import { useState } from "react";
import API from "../services/api";

const UploadPdf = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

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
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-dark text-light p-4 mb-4">
      <h2 className="h5 mb-3">
        Upload PDF
      </h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="form-control mb-3"
      />

      <button
        onClick={handleUpload}
        className="btn btn-primary"
      >
        {loading ? "Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
};

export default UploadPdf;