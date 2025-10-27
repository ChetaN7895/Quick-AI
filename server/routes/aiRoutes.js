import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  generateArticle,
  generateBlogTitle,
  generateImage,
  removeImageBackground,
  removeImageObject,
  resumeReview,
} from "../controller/aiController.js";
import { auth } from "../middleware/auth.js";
import cors from "cors"; // ✅ import cors

const aiRouter = express.Router();

// ✅ Detect environment
const isProduction = process.env.NODE_ENV === "production";

// ✅ Use /tmp for production (Vercel writable)
const uploadDir = isProduction
  ? "/tmp/uploads"
  : path.join(process.cwd(), "uploads");

// ✅ Ensure upload directory exists
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("✅ Upload directory ready:", uploadDir);
  }
} catch (err) {
  console.error("⚠️ Failed to create upload directory:", err.message);
}

// ✅ Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${uniqueSuffix}-${safeName}`);
  },
});

const upload = multer({ storage });

// ✅ Add this before any routes — handles OPTIONS preflight
aiRouter.use(cors({
  origin: ["https://quickai-techoptrack.vercel.app", "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Handle preflight explicitly for all routes
aiRouter.options("*", cors());

// ✅ Routes
aiRouter.post("/generate-articles", auth, generateArticle);
aiRouter.post("/generate-blog-titles", auth, generateBlogTitle);
aiRouter.post("/generate-image", auth, generateImage);
aiRouter.post("/remove-image-background", upload.single("image"), auth, removeImageBackground);
aiRouter.post("/remove-image-object", upload.single("image"), auth, removeImageObject);

// ✅ Fix: multer and auth only apply to POST, not preflight
aiRouter.options("/resume-review", cors()); // allow preflight to return headers
aiRouter.post("/resume-review", upload.single("resume"), auth, resumeReview);

export default aiRouter;
