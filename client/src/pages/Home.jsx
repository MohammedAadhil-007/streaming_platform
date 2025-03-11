import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaSearch } from "react-icons/fa";
import Navbar from "../components/Navbar";
import VideoCard from "../components/VideoCard";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoCollection = collection(db, "videos");
        const videoDocs = await getDocs(videoCollection);
        setVideos(videoDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  // Filter Videos
  const filteredVideos = videos.filter((video) => {
    return (
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory ? video.category === selectedCategory : true) &&
      (selectedGenre ? video.genre === selectedGenre : true)
    );
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* 🔍 Search & Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 pt-6 pb-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-1/3 mb-3 md:mb-0">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search videos..."
            className="pl-10 p-2 w-full rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-red-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          {/* 📌 Category Filter */}
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
            <option value="Music Video">Music Video</option>
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
      </div>

      {/* 🎬 Video Grid */}
      <div className="px-6">
        {filteredVideos.length === 0 ? (
          <p className="text-center text-gray-400">No videos found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
