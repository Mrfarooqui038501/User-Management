import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();
const router = express.Router();

// Configure multer
const upload = multer({ 
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    console.log("📤 Upload request received");

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("📁 File info:", {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size
    });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profiles",
      transformation: [
        { width: 500, height: 500, crop: "limit" },
        { quality: "auto" }
      ]
    });

    console.log("✅ Cloudinary upload successful:", result.secure_url);

    // Remove temporary file
    fs.unlinkSync(req.file.path);

    res.json({ 
      url: result.secure_url,
      message: "Image uploaded successfully" 
    });
  } catch (err) {
    console.error("❌ Cloudinary upload error:", err);
    
    // Clean up temp file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      message: "Image upload failed", 
      error: err.message 
    });
  }
});

export default router;