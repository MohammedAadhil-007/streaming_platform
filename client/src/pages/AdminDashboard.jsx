import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Navbar from "../components/Navbar"; 
import UploadVideo from "../components/UploadVideo";
import VideoCard from "../components/VideoCard";

const AdminDashboard = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const videoCollection = collection(db, "videos");
      const videoDocs = await getDocs(videoCollection);
      setVideos(videoDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteDoc(doc(db, "videos", videoId));
      setVideos((prev) => prev.filter((video) => video.id !== videoId));
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

        <UploadVideo onUploadSuccess={fetchVideos} />

        {loading ? (
          <p className="text-center text-gray-300">Loading videos...</p>
        ) : (
          <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 overflow-visible">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
