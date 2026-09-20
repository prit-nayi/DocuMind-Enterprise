import { useRef, useState } from "react";
import API from "../services/api";

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const UploadPdf = ({ fileInputRef, onUploadComplete, onUploadStatus }) => {
  const internalRef = useRef(null);
  const inputRef = fileInputRef || internalRef;
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      onUploadStatus?.({ type: "loading", message: `Uploading ${file.name}...` });

      const response = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUploadComplete?.({
        id: Date.now(),
        name: file.name,
        sizeLabel: formatFileSize(file.size),
        uploadedAt: new Date().toISOString(),
      });

      onUploadStatus?.({
        type: "success",
        message: response.data.message || `${file.name} uploaded successfully.`,
      });
    } catch (error) {
      console.error(error);
      onUploadStatus?.({
        type: "error",
        message: "Upload failed. Please try again.",
      });
    } finally {
      setLoading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <input
      ref={inputRef}
      type="file"
      accept="application/pdf"
      className="hidden-file-input"
      onChange={handleFileChange}
      disabled={loading}
    />
  );
};

export default UploadPdf;
