// src/components/CourseCoverUpload.js
import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import "./CourseCoverUpload.css"; // Create this CSS file for styling

const CourseCoverUpload = ({
  courseId,
  onClose,
  accessToken,
  fetchCsrfToken,
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image to upload.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const csrfToken = await fetchCsrfToken();
      if (!csrfToken) throw new Error("No CSRF token found");

      const formData = new FormData();
      formData.append("cover_picture", file);

      const response = await axios.patch(
        `https://nexus-test-api-8bf398f16fc4.herokuapp.com/courses/api/courses/${courseId}/upload-cover/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-CSRFToken": csrfToken,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setSuccess("Cover image uploaded successfully!");
      setTimeout(() => {
        onClose(); // Close the popup after success
      }, 2000);
    } catch (err) {
      console.error("Image upload failed:", err);
      if (err.response) {
        const errorMessage =
          err.response.data.cover_picture?.join(" ") ||
          err.response.data.detail ||
          "Failed to upload cover image. Please try again.";
        setError(errorMessage);
      } else {
        setError("Failed to upload cover image. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="cover-upload-modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>Upload Course Cover Image</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label htmlFor="coverImage">Select Cover Image</label>
            <input
              type="file"
              id="coverImage"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileChange}
            />
          </div>
          {preview && (
            <div className="image-preview">
              <img
                src={preview}
                alt="Cover preview"
                style={{ maxWidth: "300px", maxHeight: "200px" }}
              />
            </div>
          )}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isUploading || !file}
            >
              {isUploading ? "Uploading..." : "Upload Image"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseCoverUpload;
