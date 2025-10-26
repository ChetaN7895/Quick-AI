import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { resumeReview } from "../controllers/aiController.js";

const router = express.Router();

// ✅ Use /tmp in production (Vercel/Render safe)
const isProduction = process.env.NODE_ENV === "production";
const uploadDir = isProduction
  ? "/tmp/uploads"
  : path.join(process.cwd(), "uploads");

// ✅ Create uploads directory if not exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Upload directory created at:", uploadDir);
}

// ✅ Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

// ✅ Error handling middleware
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 5MB.",
      });
    }
  } else if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  next();
};

// ✅ Resume review route
router.post(
  "/resume-review",
  upload.single("resume"),
  handleMulterError,
  resumeReview
);

export default router;
