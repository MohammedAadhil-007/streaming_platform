import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5000/api/videos")
            .then((res) => res.json())
            .then((data) => {
                setVideos(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold text-center mb-6">🎬 Featured Videos</h1>

            {loading ? (
                <p className="text-center text-gray-400">Loading videos...</p>
            ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {videos.map((video) => (
                        <Link key={video._id} to={`/video/${video._id}`}>
                            <div className="bg-gray-800 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                                <img
                                    src={video.thumbnailUrl || "/placeholder.jpg"}
                                    alt="Thumbnail"
                                    className="w-full h-48 object-cover rounded-t-lg"
                                />
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold truncate">{video.title}</h2>
                                    <p className="text-gray-400 text-sm truncate">{video.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
