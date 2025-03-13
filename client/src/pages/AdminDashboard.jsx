import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { FaPlus, FaSignOutAlt, FaHome, FaCog } from "react-icons/fa";
import VideoSearchFilter from "../components/VideoSearchFilter";
import VideoCard from "../components/VideoCard";
import VideoActions from "../components/VideoActions";
import UploadVideo from "../components/UploadVideo";
import { MdDashboard } from "react-icons/md";
import { FaSadTear } from "react-icons/fa";

const AdminDashboard = () => {
  const [videos, setVideos] = useState([]); // All videos from Firestore
  const [filteredVideos, setFilteredVideos] = useState([]); // Displayed videos after filtering
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      const videoCollection = collection(db, "videos");
      const videoSnapshot = await getDocs(videoCollection);
      const videoList = videoSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videoList);
      setFilteredVideos(videoList); // Initially, show all videos
    };

    fetchVideos();
  }, []);

  const refreshVideos = async () => {
    const videoCollection = collection(db, "videos");
    const videoSnapshot = await getDocs(videoCollection);
    const videoList = videoSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setVideos(videoList);
    setFilteredVideos(videoList); // Reset to all videos after refresh
    setShowUploadModal(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleView = () => {
    navigate(showHome ? "/admin-dashboard" : "/home");
    setShowHome(!showHome);
  };

  // 🛠️ Filtering Logic
  useEffect(() => {
    let filtered = videos;

    if (searchQuery) {
      filtered = filtered.filter((video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((video) => video.category === selectedCategory);
    }

    if (selectedGenre) {
      filtered = filtered.filter((video) => video.genre === selectedGenre);
    }

    setFilteredVideos(filtered);
  }, [searchQuery, selectedCategory, selectedGenre, videos]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar - Glass Effect */}
      <div className="bg-gray-800 bg-opacity-80 backdrop-blur-lg p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <MdDashboard className="text-yellow-400 text-3xl animate-pulse" /> 
          Admin Dashboard
        </h1>
        <div className="flex gap-4">
          <button
            className="transition-all duration-300 bg-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-2 transform hover:scale-105"
            onClick={toggleView}
          >
            {showHome ? <FaCog /> : <FaHome />}
            {showHome ? "Admin Panel" : "Home"}
          </button>

          <button
            className="transition-all duration-300 bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 transform hover:scale-105"
            onClick={() => setShowUploadModal(true)}
          >
            <FaPlus /> Upload Video
          </button>

          <button
            className="transition-all duration-300 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 transform hover:scale-105"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* 🔍 Search and Filter - Modern Shadow Effect */}
      <div className="p-4 mx-6 mt-4 bg-gray-800 bg-opacity-90 backdrop-blur-lg rounded-lg shadow-lg ">
  <VideoSearchFilter 
    onSearchChange={setSearchQuery} 
    onCategoryChange={setSelectedCategory} 
    onGenreChange={setSelectedGenre} 
  />
</div>


      {/* 🎬 Video Grid - Modern Card Design */}
      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <div key={video.id} className="relative transition-transform transform hover:scale-105 duration-300">
              <VideoCard video={video} />
              <VideoActions videoId={video.id} refreshVideos={refreshVideos} />
            </div>
          ))
        ) : (
          // 🛑 No Videos Found Animation
          <div className="col-span-full flex flex-col items-center justify-center mt-16">
            <FaSadTear className="text-6xl text-gray-500 animate-bounce" />
            <p className="text-center text-gray-400 text-lg mt-4">No videos found.</p>
          </div>
        )}
      </div>

      {/* 📌 Upload Video Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <UploadVideo onUploadSuccess={refreshVideos} onClose={() => setShowUploadModal(false)} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
