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
      "https://quickai-techoptrack.vercel.app",
    ];

    // ✅ CORS options
    const corsOptions = {
      origin: function (origin, callback) {
        if (!origin) return callback(null, true); // allow Postman or curl
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

    // ✅ Apply CORS globally (must come before routes)
    app.use(cors(corsOptions));
    app.options("*", cors(corsOptions)); // handle all preflight requests
    app.options("/api/*", cors(corsOptions)); // specifically for API routes

    // ✅ Parse JSON
    app.use(express.json());

    // ✅ Clerk middleware for auth context
    app.use(clerkMiddleware());

    // ✅ Health check endpoint
    app.get("/_health", (req, res) =>
      res.status(200).json({ status: "ok", time: Date.now() })
    );

    // ✅ Basic test route
    app.get("/", (req, res) =>
      res.send("🚀 Quick-AI Server is Live (Vercel + Local)")
    );

    // ✅ API routes (CORS first, then auth)
    app.use("/api/ai", cors(corsOptions), requireAuth(), aiRouter);
    app.use("/api/user", cors(corsOptions), requireAuth(), userRouter);

    // ✅ Serve frontend in production
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const clientDist = path.join(__dirname, "../client-quick-ai/dist");

    if (process.env.NODE_ENV === "production") {
      app.use(express.static(clientDist, { maxAge: "1d" }));

      app.get("*", (req, res) => {
        res.sendFile(path.join(clientDist, "index.html"));
      });
    }

    // ✅ Global error handler (must be last)
    app.use((err, req, res, next) => {
      console.error("❌ Server Error:", err);
      res.status(500).json({
        message: "Internal Server Error",
        error: err.message,
      });
    });

    // ✅ Run locally if not in Vercel
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
