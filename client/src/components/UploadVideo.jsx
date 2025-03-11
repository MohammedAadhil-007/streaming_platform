import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const UploadVideo = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [genre, setGenre] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [draggingThumbnail, setDraggingThumbnail] = useState(false);
  const [draggingVideo, setDraggingVideo] = useState(false);

  const categories = ["Clips", "Movies", "Series", "Documentary"];
  const genres = ["Action", "Comedy", "Romance", "Adventure", "Horror", "Sci-Fi"];

  const handleUpload = async () => {
    if (!title || !description || !category || !genre || !thumbnail || !videoFile) {
      alert("Please fill all fields and select both a video and thumbnail.");
      return;
    }

    setLoading(true);

    try {
      // Upload Thumbnail to Cloudinary
      const thumbnailFormData = new FormData();
      thumbnailFormData.append("file", thumbnail);
      thumbnailFormData.append("upload_preset", "video_thumbnail_preset");

      const thumbnailResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dptyps19e/image/upload",
        { method: "POST", body: thumbnailFormData }
      );

      const thumbnailData = await thumbnailResponse.json();
      if (!thumbnailData.secure_url) throw new Error("Thumbnail upload failed.");
      const thumbnailUrl = thumbnailData.secure_url;

      // Upload Video to Cloudinary
      const videoFormData = new FormData();
      videoFormData.append("file", videoFile);
      videoFormData.append("upload_preset", "video_upload_preset");

      const videoResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dptyps19e/video/upload",
        { method: "POST", body: videoFormData }
      );

      const videoData = await videoResponse.json();
      if (!videoData.secure_url) throw new Error("Video upload failed.");
      const videoUrl = videoData.secure_url;

      // Save Video Details to Firestore
      await addDoc(collection(db, "videos"), {
        title,
        description,
        category,
        genre,
        thumbnailUrl,
        videoUrl,
      });

      alert("🎉 Video uploaded successfully!");

      // Reset State
      setTitle("");
      setDescription("");
      setCategory("");
      setGenre("");
      setThumbnail(null);
      setVideoFile(null);

      // Refresh Admin Dashboard
      onUploadSuccess();
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e, type) => {
    e.preventDefault();
    type === "thumbnail" ? setDraggingThumbnail(true) : setDraggingVideo(true);
  };

  const handleDragLeave = (type) => {
    type === "thumbnail" ? setDraggingThumbnail(false) : setDraggingVideo(false);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    type === "thumbnail" ? setDraggingThumbnail(false) : setDraggingVideo(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      if (type === "thumbnail" && file.type.startsWith("image/")) {
        setThumbnail(file);
      } else if (type === "video" && file.type.startsWith("video/")) {
        setVideoFile(file);
      } else {
        alert("Invalid file type!");
      }
    }
  };

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-xl max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Upload Video</h2>

      <input
        type="text"
        placeholder="Title"
        className="w-full p-3 mb-4 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Description"
        className="w-full p-3 mb-4 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <select
        className="w-full p-3 mb-4 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="" disabled>Select a category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <select
        className="w-full p-3 mb-4 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        required
      >
        <option value="" disabled>Select a genre</option>
        {genres.map((gen) => (
          <option key={gen} value={gen}>{gen}</option>
        ))}
      </select>

      {/* Thumbnail Upload Box */}
      <div
        className={`w-full p-6 mb-4 border-2 border-dashed rounded-lg text-white text-center cursor-pointer transition-all ${
          draggingThumbnail ? "border-blue-500 bg-gray-700" : "border-gray-600 bg-gray-800"
        }`}
        onClick={() => document.getElementById("thumbnailInput").click()}
        onDragOver={(e) => handleDragOver(e, "thumbnail")}
        onDragLeave={() => handleDragLeave("thumbnail")}
        onDrop={(e) => handleDrop(e, "thumbnail")}
      >
        <input id="thumbnailInput" type="file" className="hidden" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} />
        {thumbnail ? `✅ ${thumbnail.name}` : "📸 Click or Drag Thumbnail Here"}
      </div>

      {/* Video Upload Box */}
      <div
        className={`w-full p-6 mb-4 border-2 border-dashed rounded-lg text-white text-center cursor-pointer transition-all ${
          draggingVideo ? "border-blue-500 bg-gray-700" : "border-gray-600 bg-gray-800"
        }`}
        onClick={() => document.getElementById("videoInput").click()}
        onDragOver={(e) => handleDragOver(e, "video")}
        onDragLeave={() => handleDragLeave("video")}
        onDrop={(e) => handleDrop(e, "video")}
      >
        <input id="videoInput" type="file" className="hidden" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
        {videoFile ? `🎥 ${videoFile.name}` : "🎬 Click or Drag Video Here"}
      </div>

      <button
        onClick={handleUpload}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-lg font-bold"
        disabled={loading}
      >
        {loading ? "Uploading..." : "🚀 Upload Video"}
      </button>
    </div>
  );
};

export default UploadVideo;
