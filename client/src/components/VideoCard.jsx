import { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";

const VideoCard = ({ video }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(null);

  // Fetch video duration
  useEffect(() => {
    if (video.videoUrl) {
      const tempVideo = document.createElement("video");
      tempVideo.src = video.videoUrl;

      tempVideo.onloadedmetadata = () => {
        if (!isNaN(tempVideo.duration)) {
          const totalSeconds = Math.floor(tempVideo.duration);
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;
          setDuration(`${minutes}:${seconds.toString().padStart(2, "0")}`);
        }
      };
    }
  }, [video.videoUrl]);

  return (
    <div
      className="flex flex-col items-start w-64 md:w-72 lg:w-80 cursor-pointer"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Video or Thumbnail */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
        <div onClick={() => setIsPlaying(true)} className="w-full h-full">
          {isPlaying ? (
            <video
              src={video.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <>
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover rounded-lg transition-transform 
                duration-300 hover:scale-105"
              />
              {/* 🔹 Video Duration */}
              {duration && (
                <span
                  className="absolute bottom-2 right-2 bg-black text-white text-xs font-bold 
                  px-2 py-1 rounded opacity-90"
                >
                  {duration}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* 🔹 Video Title Below (Like YouTube) */}
      <h2 className="mt-2 text-white text-base md:text-lg font-bold line-clamp-2">
        {video.title}
      </h2>

      {/* 🔹 Hover Details */}
      {showDetails && !isPlaying && (
        <div
          className="absolute left-0 top-full mt-3 w-[28rem] bg-gray-900 text-white 
          p-4 rounded-lg shadow-xl border border-gray-700 z-50 transition-all 
          duration-300 opacity-100 transform scale-100"
        >
          {/* ⬆️ Arrow Indicator */}
          <div className="absolute -top-2 left-8 w-4 h-4 bg-gray-900 rotate-45 border-l border-t border-gray-700"></div>

          <p className="text-sm text-gray-400 mt-2">Category: {video.category}</p>
          <p className="text-sm text-gray-400">Genre: {video.genre}</p>
          <p className="text-sm text-gray-500 mt-2">{video.description}</p>

          {/* 🔹 Watch Now Button */}
          <button
            className="mt-3 w-full flex items-center justify-center gap-2 bg-red-600 px-6 py-3 
            rounded-lg font-bold hover:bg-red-700 text-lg"
            onClick={() => setIsPlaying(true)} // ⬅️ Play video on click
          >
            <FaPlay className="text-black text-xl" /> Watch Now
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoCard;
