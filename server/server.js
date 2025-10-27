import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import connectCloudinary from "./config/cloudinary.js";
import aiRouter from "./routes/aiRoutes.js";
import userRouter from "./routes/userRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import serverless from "serverless-http";

const app = express();

async function startServer() {
  try {
    await connectCloudinary();
    console.log("☁️ Connected to Cloudinary");

    const allowedOrigins = [
      "http://localhost:5173",
      "https://quickai-techoptrack.vercel.app"
    ];

    // ✅ Unified CORS middleware
    const corsOptions = {
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS not allowed for origin: ${origin}`));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    };

    // ✅ Apply CORS globally (no * versions)
    app.use(cors(corsOptions));
    app.options("*", cors(corsOptions)); // handles preflight correctly

    app.use(express.json());
    app.use(clerkMiddleware());

    // ✅ Health check
    app.get("/_health", (req, res) =>
      res.status(200).json({ status: "ok", time: Date.now() })
    );

    app.get("/", (req, res) =>
      res.send("🚀 Quick-AI Server is Live (Vercel + Local)")
    );

    // ✅ API routes (still protected)
    app.use("/api/ai", requireAuth(), aiRouter);
    app.use("/api/user", requireAuth(), userRouter);

    // ✅ Serve frontend if needed
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const clientDist = path.join(__dirname, "../client-quick-ai/dist");

    if (process.env.NODE_ENV === "production") {
      app.use(express.static(clientDist, { maxAge: "1d" }));
      app.get("*", (req, res) => {
        res.sendFile(path.join(clientDist, "index.html"));
      });
    }

    // ✅ Global error handler
    app.use((err, req, res, next) => {
      console.error("❌ Server Error:", err);
      res.status(500).json({
        message: "Internal Server Error",
        error: err.message,
      });
    });

    if (process.env.VERCEL !== "1") {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () =>
        console.log(`✅ Server running locally on port ${PORT}`)
      );
    }
  } catch (err) {
    console.error("❌ Startup failed:", err);
  }
}

startServer();

export const handler = serverless(app);
export default app;
