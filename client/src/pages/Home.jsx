import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar";
import VideoCard from "../components/VideoCard";

const Home = () => {
  const [videos, setVideos] = useState([]);

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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Videos</h1>
        {videos.length === 0 ? (
          <p className="text-center text-gray-400">No videos available.</p>
        ) : (
          <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 overflow-visible">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
