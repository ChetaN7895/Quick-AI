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

// ✅ Smart CORS setup (works for local + Vercel)
const allowedOrigins = [
  "http://localhost:5173",
  "https://quick-ai.vercel.app" // your frontend domain on Vercel
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

// ✅ Public route (no auth)
app.get("/", (req, res) => res.send("🚀 Server is Live on Vercel & Local!"));

// ✅ Fix 500 favicon error
app.get("/favicon.ico", (req, res) => res.status(204).end());

// ✅ Protected routes only
app.use("/api/ai", requireAuth(), aiRouter);
app.use("/api/user", requireAuth(), userRouter);

// ✅ Error handler (for better debug)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// ✅ Run server locally, but not on Vercel
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server running locally on port ${PORT}`);
  });
}

// ✅ Export app for Vercel serverless handler
export default app;
