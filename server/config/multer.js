import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors"; // ✅ import CORS
import { resumeReview } from "../controllers/aiController.js";

const router = express.Router();

// ✅ Detect environment
const isProduction = process.env.NODE_ENV === "production";

// ✅ Safe upload directory
const uploadDir = isProduction
  ? "/tmp/uploads" // ✅ Vercel/Render writable directory
  : path.join(process.cwd(), "uploads");

// ✅ Ensure directory exists (safe check)
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("✅ Upload directory created:", uploadDir);
  }
} catch (err) {
  console.error("❌ Failed to create upload directory:", err.message);
}

// ✅ Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${uniqueSuffix}-${safeName}`);
  },
});

// ✅ Multer instance
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"), false);
  },
});

// ✅ Multer error middleware
const handleMulterError = (err, req, res, next) => {
  if (!err) return next();

  // Delete uploaded file if exists (incomplete uploads)
  if (req.file?.path && fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum allowed size is 5MB.",
      });
    }
  }

  return res.status(400).json({
    success: false,
    message: err.message || "File upload error",
  });
};

// ✅ Add this before routes to fix CORS & preflight
const corsOptions = {
  origin: ["https://quickai-techoptrack.vercel.app", "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
router.use(cors(corsOptions));
router.options("*", cors(corsOptions)); // handle preflight

// ✅ Resume Review endpoint
router.post(
  "/resume-review",
  upload.single("resume"),
  handleMulterError,
  resumeReview
);

export default router;
