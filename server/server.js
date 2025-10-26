import express from "express";
import cors from "cors";
import "dotenv/config";
import aiRouter from "./routes/aiRoutes.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

(async () => {
  // ✅ Connect Cloudinary safely
  await connectCloudinary();

  // ✅ Smart CORS setup
  const allowedOrigins = [
    "http://localhost:5173",
    "https://quick-ai.vercel.app"
  ];

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
  );

  app.use(express.json());
  app.use(clerkMiddleware());

  // Public route
  app.get("/", (req, res) => res.send("🚀 Server is Live on Vercel & Local!"));
  app.get("/favicon.ico", (req, res) => res.status(204).end());

  // Protected routes
  app.use("/api/ai", requireAuth(), aiRouter);
  app.use("/api/user", requireAuth(), userRouter);

  // Error handler
  app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  });

  // Run locally only
  if (process.env.VERCEL !== "1") {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`✅ Server running locally on port ${PORT}`);
    });
  }
})();

export default app;
