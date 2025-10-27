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

    // ✅ Allowed origins (no trailing slashes)
    const allowedOrigins = [
      "http://localhost:5173",
      "https://quickai-techoptrack.vercel.app"
    ];

    // ✅ Handle preflight requests globally
    app.options("*", cors());

    // ✅ CORS middleware
    app.use(
      cors({
        origin: function (origin, callback) {
          if (!origin) return callback(null, true); // allow server-to-server or curl
          if (!allowedOrigins.includes(origin)) {
            return callback(
              new Error(`CORS policy does not allow access from origin: ${origin}`),
              false
            );
          }
          return callback(null, true);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    app.use(express.json());
    app.use(clerkMiddleware());

    // ✅ Health check endpoint
    app.get("/_health", (req, res) =>
      res.status(200).json({ status: "ok", time: Date.now() })
    );

    app.get("/", (req, res) =>
      res.send("🚀 Quick-AI Server is Live (Vercel + Local)")
    );

    // ✅ AI and User routes
    // Allow OPTIONS preflight without auth
    app.options("/api/*", cors());
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

    // ✅ Local dev only
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

// ✅ Export handler for Vercel serverless
export const handler = serverless(app);
export default app;
