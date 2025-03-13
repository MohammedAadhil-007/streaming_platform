import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { FaCloudUploadAlt, FaTimes, FaImage, FaVideo, FaTrash } from "react-icons/fa";

const UploadVideo = ({ onUploadSuccess, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [genre, setGenre] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState({ thumbnail: false, video: false });

  const categories = ["Clips", "Movies", "Series", "Documentary"];
  const genres = ["Action", "Comedy", "Romance", "Adventure", "Horror", "Sci-Fi"];

  const handleUpload = async () => {
    if (!title || !description || !category || !genre || !thumbnail || !videoFile) {
      alert("⚠ Please fill all fields and upload both a video and a thumbnail.");
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

      // Refresh Admin Dashboard & Close Modal
      onUploadSuccess();
      onClose();
    } catch (error) {
      console.error("Error uploading:", error);
      alert("❌ Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e, type) => {
    e.preventDefault();
    setDragging((prev) => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (type) => {
    setDragging((prev) => ({ ...prev, [type]: false }));
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setDragging((prev) => ({ ...prev, [type]: false }));

    const file = e.dataTransfer.files[0];
    if (file) {
      if (type === "thumbnail" && file.type.startsWith("image/")) {
        setThumbnail(file);
      } else if (type === "video" && file.type.startsWith("video/")) {
        setVideoFile(file);
      } else {
        alert("⚠ Invalid file type!");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-[420px] relative border border-gray-700">
        
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-all text-xl"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-semibold text-white mb-4 text-center flex items-center justify-center">
          <FaCloudUploadAlt className="text-blue-400 mr-2" /> Upload Video
        </h2>

        {/* Title & Description */}
        <input
          type="text"
          placeholder="Video Title"
          className="w-full p-2 mb-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Video Description"
          className="w-full p-2 mb-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* Category & Genre Selection */}
        <div className="flex gap-3">
          <select className="w-1/2 p-2 bg-gray-800 text-white border border-gray-600 rounded-md"
            value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Category</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select className="w-1/2 p-2 bg-gray-800 text-white border border-gray-600 rounded-md"
            value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">Genre</option>
            {genres.map((gen) => <option key={gen} value={gen}>{gen}</option>)}
          </select>
        </div>

        {/* Upload Sections */}
        <div className="grid gap-3 mt-3">
          <label className="text-gray-400 text-sm">Upload Thumbnail</label>
          <div className={`p-5 border-2 border-dashed rounded-md bg-gray-800 cursor-pointer transition-all 
            ${dragging.thumbnail ? "border-blue-400" : "border-gray-600"}`}
            onClick={() => document.getElementById("thumbnailInput").click()}
            onDragOver={(e) => handleDragOver(e, "thumbnail")}
            onDragLeave={() => handleDragLeave("thumbnail")}
            onDrop={(e) => handleDrop(e, "thumbnail")}>
            <input id="thumbnailInput" type="file" className="hidden" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} />
            {thumbnail ? <span className="flex items-center justify-between">{thumbnail.name} <FaTrash className="text-red-500 cursor-pointer" onClick={() => setThumbnail(null)} /></span> : <FaImage className="text-blue-400 text-2xl mx-auto" />}
          </div>

          <label className="text-gray-400 text-sm mt-2">Upload Video</label>
          <div className={`p-5 border-2 border-dashed rounded-md bg-gray-800 cursor-pointer transition-all 
            ${dragging.video ? "border-blue-400" : "border-gray-600"}`}
            onClick={() => document.getElementById("videoInput").click()}
            onDragOver={(e) => handleDragOver(e, "video")}
            onDragLeave={() => handleDragLeave("video")}
            onDrop={(e) => handleDrop(e, "video")}>
            <input id="videoInput" type="file" className="hidden" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
            {videoFile ? <span className="flex items-center justify-between">{videoFile.name} <FaTrash className="text-red-500 cursor-pointer" onClick={() => setVideoFile(null)} /></span> : <FaVideo className="text-blue-400 text-2xl mx-auto" />}
          </div>
        </div>

        {/* Upload Button */}
        <button onClick={handleUpload} className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md">{loading ? "Uploading..." : "Upload Video"}</button>
      </div>
    </div>
  );
};

export default UploadVideo;
