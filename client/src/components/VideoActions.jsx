import { FaEdit, FaTrash } from "react-icons/fa";
import { deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";

const VideoActions = ({ videoId, refreshVideos }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await deleteDoc(doc(db, "videos", videoId));
        refreshVideos(); 
      } catch (error) {
        console.error("Error deleting video:", error);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/admin/edit/${videoId}`);
  };

  return (
    <div className="absolute top-2 right-2 flex gap-2">
      <button className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700" onClick={handleEdit}>
        <FaEdit />
      </button>
      <button className="bg-red-600 p-2 rounded-lg hover:bg-red-700" onClick={handleDelete}>
        <FaTrash />
      </button>
    </div>
  );
};

export default VideoActions;
