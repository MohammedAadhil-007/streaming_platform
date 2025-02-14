import { useState } from "react";

const AdminDashboard = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const fileURL = URL.createObjectURL(selectedFile);
            setPreview(fileURL);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage("Please select a video file.");
            return;
        }

        setUploading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("video", file);

        try {
            const res = await fetch("http://localhost:5000/api/videos/upload", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await res.json();
            setMessage(data.message);
        } catch (error) {
            setMessage("Upload failed. Try again.");
        }

        setUploading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6">📤 Upload New Video</h1>

            <form onSubmit={handleUpload} className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
                <input
                    type="text"
                    placeholder="Title"
                    className="w-full p-3 mb-4 bg-gray-700 text-white rounded outline-none focus:ring-2 focus:ring-blue-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Description"
                    className="w-full p-3 mb-4 bg-gray-700 text-white rounded outline-none focus:ring-2 focus:ring-blue-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <input
                    type="file"
                    accept="video/mp4"
                    className="w-full p-2 bg-gray-700 text-white rounded"
                    onChange={handleFileChange}
                    required
                />

                {preview && (
                    <video className="mt-4 w-full rounded-lg shadow-lg" controls>
                        <source src={preview} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}

                <button
                    type="submit"
                    className={`w-full mt-4 py-2 rounded bg-blue-500 hover:bg-blue-600 transition ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={uploading}
                >
                    {uploading ? "Uploading..." : "Upload Video"}
                </button>

                {message && (
                    <p className="mt-4 text-center text-sm text-green-400">{message}</p>
                )}
            </form>
        </div>
    );
};

export default AdminDashboard;
