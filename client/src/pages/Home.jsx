import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar"; // ✅ Import Navbar

const Home = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoCollection = collection(db, "videos");
        const videoDocs = await getDocs(videoCollection);
        const videosList = videoDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVideos(videosList);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
  
    fetchVideos();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar /> {/* ✅ Add Navbar here */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Videos</h1>
        {videos.length === 0 ? (
          <p className="text-center text-gray-400">No videos available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold">{video.title}</h2>
                <p className="text-sm text-gray-400">{video.description}</p>
                <video className="w-full mt-2 rounded-lg" controls>
                  <source src={video.url} type="video/mp4" />
                </video>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
