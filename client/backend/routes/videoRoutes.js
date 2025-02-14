const express = require("express");
const multer = require("multer");
const Video = require("../models/Video");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save videos in "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// Upload Video (Admin Only)
router.post("/upload", authMiddleware, upload.single("video"), async (req, res) => {
    try {
        const { title, description } = req.body;
        const video = new Video({
            title,
            description,
            videoUrl: `/uploads/${req.file.filename}`
        });
        await video.save();
        res.status(201).json({ message: "Video uploaded successfully", video });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Videos
router.get("/", async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
