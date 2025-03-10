import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const UploadVideo = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(null); // Default is null
  const [genre, setGenre] = useState(null); // Default is null
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = ["Clips", "Movies", "Series", "Documentary"];
  const genres = ["Action", "Comedy", "Romance", "Adventure", "Horror", "Sci-Fi"];

  const handleUpload = async () => {
    if (!title || !description || !category || !genre || !thumbnail || !videoFile) {
      alert("Please fill all fields and select both a video and thumbnail.");
      return;
    }

    setLoading(true);

    try {
      // Upload thumbnail to Cloudinary
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

      // Upload video to Cloudinary
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

      // Save video details to Firestore
      await addDoc(collection(db, "videos"), {
        title,
        description,
        category,
        genre,
        thumbnailUrl,
        videoUrl,
      });

      alert("Video uploaded successfully!");
      setTitle("");
      setDescription("");
      setCategory(null);
      setGenre(null);
      setThumbnail(null);
      setVideoFile(null);
      onUploadSuccess();
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Upload failed. Please try again.");
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
        className="w-full p-2 mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        className="w-full p-2 mb-3"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      
      {/* Category Dropdown */}
      <select
        className="w-full p-2 mb-3"
        value={category || ""}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="" disabled>Select a category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Genre Dropdown */}
      <select
        className="w-full p-2 mb-3"
        value={genre || ""}
        onChange={(e) => setGenre(e.target.value)}
        required
      >
        <option value="" disabled>Select a genre</option>
        {genres.map((gen) => (
          <option key={gen} value={gen}>{gen}</option>
        ))}
      </select>

      {/* Thumbnail Upload */}
      <input
        type="file"
        accept="image/*"
        className="w-full p-2 mb-3 bg-gray-700 rounded"
        onChange={(e) => setThumbnail(e.target.files[0])}
        required
      />

      {/* Video Upload */}
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
