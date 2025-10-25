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
  resumeReview 
} from "../controller/aiController.js";
import { auth } from "../middleware/auth.js";

// ✅ Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Created uploads directory:", uploadDir);
}

// ✅ Configure multer to use absolute path
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const aiRouter = express.Router();

// ✅ AI Routes
aiRouter.post("/generate-articles", auth, generateArticle);
aiRouter.post("/generate-blog-titles", auth, generateBlogTitle);
aiRouter.post("/generate-image", auth, generateImage);
aiRouter.post("/remove-image-background", upload.single("image"), auth, removeImageBackground);
aiRouter.post("/remove-image-object", upload.single("image"), auth, removeImageObject);
aiRouter.post("/resume-review", upload.single("resume"), auth, resumeReview);

export default aiRouter;
