import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FaSave, FaTimes, FaImage, FaUpload } from "react-icons/fa";

const categories = ["Clips", "Movies", "Series", "Documentary"];
const genres = ["Action", "Comedy", "Romance", "Adventure", "Horror", "Sci-Fi"];

const EditVideo = () => {
  const { id } = useParams(); // Get video ID from URL
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [genre, setGenre] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [newThumbnail, setNewThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // 🔹 Fetch video details
  useEffect(() => {
    const fetchVideo = async () => {
      const videoRef = doc(db, "videos", id);
      const videoSnap = await getDoc(videoRef);

      if (videoSnap.exists()) {
        const data = videoSnap.data();
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setGenre(data.genre);
        setThumbnailUrl(data.thumbnailUrl);
      } else {
        alert("⚠ Video not found!");
        navigate("/admin-dashboard");
      }
    };

    fetchVideo();
  }, [id, navigate]);

  // 🔹 Upload new thumbnail to Cloudinary (if changed)
  const uploadThumbnail = async () => {
    if (!newThumbnail) return thumbnailUrl;

    const formData = new FormData();
    formData.append("file", newThumbnail);
    formData.append("upload_preset", "video_thumbnail_preset");

    const response = await fetch("https://api.cloudinary.com/v1_1/dptyps19e/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.secure_url;
  };

  // 🔹 Handle Update
  const handleUpdate = async () => {
    if (!title || !description || !category || !genre) {
      alert("⚠ All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const updatedThumbnailUrl = await uploadThumbnail(); // Upload new thumbnail if changed

      const videoRef = doc(db, "videos", id);
      await updateDoc(videoRef, {
        title,
        description,
        category,
        genre,
        thumbnailUrl: updatedThumbnailUrl,
      });

      alert("✅ Video updated successfully!");
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Error updating video:", error);
      alert("❌ Update failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Drag & Drop
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setNewThumbnail(file);
    } else {
      alert("❌ Please drop an image file.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[420px] relative border border-gray-700">
        
        {/* ❌ Close Button */}
        <button onClick={() => navigate("/admin-dashboard")} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-all text-xl">
          <FaTimes />
        </button>

        <h2 className="text-2xl font-semibold text-white mb-4 text-center">
          Edit Video
        </h2>

        {/* Title & Description */}
        <input type="text" placeholder="Video Title" className="w-full p-2 mb-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          value={title} onChange={(e) => setTitle(e.target.value)} required />
        
        <textarea placeholder="Video Description" className="w-full p-2 mb-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          value={description} onChange={(e) => setDescription(e.target.value)} required />

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

        {/* Thumbnail Upload with Drag & Drop */}
        <div className="mt-4">
          <label className="text-gray-400 text-sm">Change Thumbnail</label>
          <div 
            className={`relative border-2 ${dragActive ? "border-blue-400 bg-gray-700" : "border-gray-600"} rounded-md bg-gray-800 cursor-pointer p-4 flex items-center justify-center`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input type="file" accept="image/*" className="hidden" id="thumbnailInput"
              onChange={(e) => setNewThumbnail(e.target.files[0])} />
            <label htmlFor="thumbnailInput" className="cursor-pointer flex flex-col items-center">
              <FaUpload className="text-blue-400 text-2xl" />
              {newThumbnail ? newThumbnail.name : "Click or Drag & Drop to Upload"}
            </label>
          </div>
        </div>

        {/* Save Button */}
        <button onClick={handleUpdate} className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md">
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditVideo;
