import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Navbar from "../components/Navbar"; 
import UploadVideo from "../components/UploadVideo"; // ✅ Import Upload Component

const AdminDashboard = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch videos from Firestore on component mount
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const videoCollection = collection(db, "videos");
        const videoDocs = await getDocs(videoCollection);
        setVideos(
          videoDocs.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchVideos();
  }, []); // Run only once when component mounts

  // Delete a video from Firestore
  const handleDelete = async (videoId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this video?");
    if (!confirmDelete) return;
    
    try {
      await deleteDoc(doc(db, "videos", videoId));
      // Remove deleted video from state
      setVideos((prevVideos) => prevVideos.filter((video) => video.id !== videoId));
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

        {/* ✅ Upload Video Section */}
        <UploadVideo onUploadSuccess={() => setVideos([])} /> {/* Refresh video list after upload */}

        {loading ? (
          <p className="text-center text-gray-400">Loading videos...</p>
        ) : videos.length === 0 ? (
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
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-3"
                  onClick={() => handleDelete(video.id)}
                >
                  Delete Video
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
