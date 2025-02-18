import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const UploadVideo = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!title || !description || !videoFile) {
      alert("Please fill all fields and select a video.");
      return;
    }

    // File validation: check type and size
    const validTypes = ["video/mp4", "video/mkv", "video/avi"];
    const maxSize = 100 * 1024 * 1024; // 100MB

    if (!validTypes.includes(videoFile.type)) {
      alert("Invalid file type. Please upload a video in MP4, MKV, or AVI format.");
      return;
    }

    if (videoFile.size > maxSize) {
      alert("File is too large. Maximum size is 100MB.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("upload_preset", "video_upload_preset"); // Ensure this matches your Cloudinary preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dptyps19e/video/upload", // Update with your Cloudinary URL
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      // Ensure response contains the secure URL
      if (!data.secure_url) {
        throw new Error("Cloudinary upload failed: No video URL returned.");
      }

      const videoUrl = data.secure_url;

      // Save video details to Firestore
      await addDoc(collection(db, "videos"), {
        title,
        description,
        url: videoUrl,
      });

      alert("Video uploaded successfully!");
      setTitle("");
      setDescription("");
      setVideoFile(null);
      onUploadSuccess(); // Refresh video list in AdminDashboard
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-bold mb-4">Upload Video</h2>
      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 mb-3 text-black rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        className="w-full p-2 mb-3 text-black rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="file"
        accept="video/*"
        className="w-full p-2 mb-3 bg-gray-700 rounded"
        onChange={(e) => setVideoFile(e.target.files[0])}
        required
      />
      <button
        onClick={handleUpload}
        className="w-full py-2 bg-blue-500 rounded hover:bg-blue-600 transition"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Video"}
      </button>
    </div>
  );
};

export default UploadVideo;
