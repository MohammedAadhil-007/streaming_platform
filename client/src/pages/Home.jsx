import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar";
import VideoCard from "../components/VideoCard";
import VideoSearchFilter from "../components/VideoSearchFilter";

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
      <div className="p-6">
        <VideoSearchFilter
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onGenreChange={setSelectedGenre}
        />
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
