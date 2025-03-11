import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth"; // ✅ Import signOut correctly
import { auth, db } from "../firebase";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaTimes, FaSignOutAlt } from "react-icons/fa";
import VideoCard from "../components/VideoCard";
import UploadVideo from "../components/UploadVideo";

const AdminDashboard = () => {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const navigate = useNavigate();

  // Fetch videos from Firestore
  useEffect(() => {
    const fetchVideos = async () => {
      const videoCollection = collection(db, "videos");
      const videoSnapshot = await getDocs(videoCollection);
      const videoList = videoSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videoList);
    };

    fetchVideos();
  }, []);

  // Delete a video from Firestore
  const handleDelete = async (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      await deleteDoc(doc(db, "videos", videoId));
      setVideos(videos.filter((video) => video.id !== videoId));
    }
  };

  // Refresh the video list after an upload
  const refreshVideos = async () => {
    const videoCollection = collection(db, "videos");
    const videoSnapshot = await getDocs(videoCollection);
    const videoList = videoSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setVideos(videoList);
    setShowUploadModal(false); // Close modal after upload
  };

  // Logout Admin
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Filter videos based on search, category, and genre
  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory ? video.category === selectedCategory : true) &&
      (selectedGenre ? video.genre === selectedGenre : true)
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* 🔹 Merged Navbar into Admin Dashboard */}
      <div className="bg-gray-800 p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button
            className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            onClick={() => setShowUploadModal(true)}
          >
            <FaPlus /> Upload Video
          </button>
          <button
            className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* 🔹 Search & Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* 🔍 Search Bar */}
          <div className="relative flex-grow">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos..."
              className="pl-10 p-2 w-full rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-red-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* 🎭 Category Filter */}
          <select
            className="p-2 rounded bg-gray-800 text-white border border-gray-600"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Clips">Clips</option>
            <option value="Movies">Movies</option>
            <option value="Series">Series</option>
            <option value="Documentary">Documentary</option>
          </select>

          {/* 🎭 Genre Filter */}
          <select
            className="p-2 rounded bg-gray-800 text-white border border-gray-600"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Romance">Romance</option>
            <option value="Adventure">Adventure</option>
            <option value="Horror">Horror</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Drama">Drama</option>
            <option value="Thriller">Thriller</option>
          </select>
        </div>

        {/* 🔹 Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) =>
              video.id ? (
                <div key={video.id} className="relative">
                  <VideoCard video={video} />
                  {/* 🔹 Edit & Delete Buttons */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700"
                      onClick={() => navigate(`/admin/edit/${video.id}`)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-600 p-2 rounded-lg hover:bg-red-700"
                      onClick={() => handleDelete(video.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ) : null
            )
          ) : (
            <p className="text-gray-400 col-span-full text-center">
              No videos found.
            </p>
          )}
        </div>

        {/* 🔹 Upload Video Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg relative w-full max-w-md">
              <button
                className="absolute top-3 right-3 text-white hover:text-gray-400"
                onClick={() => setShowUploadModal(false)}
              >
                <FaTimes size={20} />
              </button>
              <UploadVideo onUploadSuccess={refreshVideos} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
