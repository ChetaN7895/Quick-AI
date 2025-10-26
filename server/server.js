import express from "express";
import cors from "cors";
import "dotenv/config";
import aiRouter from "./routes/aiRoutes.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// ✅ Connect to Cloudinary before routes
await connectCloudinary();

// ✅ CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://quick-ai.vercel.app" // replace with your deployed frontend domain
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use(clerkMiddleware());

// ✅ Public route
app.get("/", (req, res) => res.send("🚀 Backend is Live on Vercel!"));

// ✅ Protected routes
app.use(requireAuth());
app.use("/api/ai", aiRouter);
app.use("/api/user", userRouter);

// ❌ Remove app.listen()
// ✅ Instead, export the app for Vercel to handle
export default app;
