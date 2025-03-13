import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar";
import VideoCard from "../components/VideoCard";
import VideoSearchFilter from "../components/VideoSearchFilter";
import { MdFilterList } from "react-icons/md";
import { FaSadTear } from "react-icons/fa";

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
        const videoData = videoDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setVideos(videoData);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  // ✅ Case-insensitive filtering
  const filteredVideos = videos.filter((video) => {
    const titleMatch = video.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = selectedCategory ? video.category?.toLowerCase() === selectedCategory.toLowerCase() : true;
    const genreMatch = selectedGenre ? video.genre?.toLowerCase() === selectedGenre.toLowerCase() : true;

    return titleMatch && categoryMatch && genreMatch;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* 🔍 Search & Filter Section */}
      <div className="p-6 bg-gray-800 bg-opacity-80 backdrop-blur-lg shadow-lg rounded-lg mx-4 mt-6 animate-fadeIn">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-yellow-400 mb-4">
          <MdFilterList className="text-2xl text-blue-400 animate-pulse" /> Search & Filter
        </h2>
        <VideoSearchFilter
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onGenreChange={setSelectedGenre}
        />
      </div>

      {/* 🎬 Video Grid */}
      <div className="px-4 md:px-8 lg:px-12 xl:px-16 mt-6">
        {filteredVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16">
            <FaSadTear className="text-6xl text-gray-500 animate-bounce" />
            <p className="text-center text-gray-400 text-lg mt-4">No videos found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <div 
                key={video.id} 
                className="relative transition-transform transform hover:scale-105 duration-300"
              >
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
