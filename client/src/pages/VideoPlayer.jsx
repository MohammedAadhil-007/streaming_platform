import { useParams } from "react-router-dom";

const VideoPlayer = () => {
    const { id } = useParams();
    const videoUrl = `http://localhost:5000/uploads/${id}.mp4`;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Video Player</h1>
            <video controls className="w-full mt-4">
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
