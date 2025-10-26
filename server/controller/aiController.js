import OpenAI from "openai";
import sql from "../config/db.js";
import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import connectCloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import FormData from "form-data";
import pdf from "pdf-parse";

// ✅ Initialize paths (for safe absolute resolution)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Connect Cloudinary
connectCloudinary();

// ✅ Initialize Gemini (OpenAI-compatible) API
const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});


// ✅ Generate AI Article
export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: length || 500,
    });

    const content = response.choices?.[0]?.message?.content || "No response.";

    const [newCreation] = await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
      RETURNING *;
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    return res.json({ success: true, content, creation: newCreation });
  } catch (error) {
    console.error("generateArticle Error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};


// ✅ Generate Blog Title
export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 100,
    });

    const content = response.choices?.[0]?.message?.content || "No response.";

    const [newCreation] = await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
      RETURNING *;
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    return res.json({ success: true, content, creation: newCreation });
  } catch (error) {
    console.error("generateBlogTitle Error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};


// ✅ Generate Image (ClipDrop + Cloudinary)
export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 1) {
      return res.json({
        success: false,
        message:
          "🎨 You've used your 1 free image. Upgrade to Premium for unlimited creations!",
        premium_required: true,
      });
    }

    // ✅ Sanitize prompt
    const cleanPrompt = prompt
      .replace(/\b(student|child|kid|boy|girl|teen)\b/gi, "person")
      .replace(/\b(lying|hurt|injured|naked|bleeding|crying)\b/gi, "standing")
      .replace(/\b(on the ground|in bed|school|classroom)\b/gi, "in a bright room")
      .replace(/\b(blood|weapon|corpse|dead|fight)\b/gi, "object")
      .replace(/\s+/g, " ")
      .trim();

    const finalPrompt = `A safe, artistic, visually appealing image of ${cleanPrompt}. Must be suitable for all audiences.`;

    // ✅ Generate with ClipDrop
    const formData = new FormData();
    formData.append("prompt", finalPrompt);

    let imageResponse;
    try {
      imageResponse = await axios.post(
        "https://clipdrop-api.co/text-to-image/v1",
        formData,
        {
          headers: {
            "x-api-key": process.env.CLIPDROP_API_KEY,
            ...formData.getHeaders(),
          },
          responseType: "arraybuffer",
        }
      );
    } catch (apiError) {
      console.error("ClipDrop API Error:", apiError?.response?.statusText);
      return res.json({
        success: false,
        message: "Image generation failed. Try rephrasing your prompt.",
      });
    }

    // ✅ Upload to Cloudinary
    const base64Image = `data:image/png;base64,${Buffer.from(
      imageResponse.data,
      "binary"
    ).toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: "ai_creations",
    });

    const secure_url = uploadResult.secure_url;

    const [newCreation] = await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
      RETURNING *;
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    return res.json({
      success: true,
      content: secure_url,
      creation: newCreation,
      message:
        plan === "premium"
          ? "✅ Image generated successfully (Premium Access)"
          : "✅ Your free image has been generated!",
    });
  } catch (error) {
    console.error("generateImage Error:", error.message);
    return res.json({ success: false, message: "Image generation failed." });
  }
};


// ✅ Remove Image Background
export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only for premium users",
      });
    }

    if (!fs.existsSync(image.path)) {
      return res.json({ success: false, message: "Uploaded file not found." });
    }

    const uploadResult = await cloudinary.uploader.upload(image.path, {
      transformation: [{ effect: "background_removal" }],
    });

    const secure_url = uploadResult.secure_url;

    const [newCreation] = await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove Background from Image', ${secure_url}, 'image')
      RETURNING *;
    `;

    if (fs.existsSync(image.path)) fs.unlinkSync(image.path);
    return res.json({ success: true, content: secure_url, creation: newCreation });
  } catch (error) {
    console.error("removeImageBackground Error:", error.message);
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.json({ success: false, message: error.message });
  }
};


// ✅ Remove Object from Image
export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only for premium users",
      });
    }

    if (!fs.existsSync(image.path)) {
      return res.json({ success: false, message: "Uploaded file not found." });
    }

    const uploadResult = await cloudinary.uploader.upload(image.path);
    const public_id = uploadResult.public_id;

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    const [newCreation] = await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Remove ${object} from image`}, ${imageUrl}, 'image')
      RETURNING *;
    `;

    if (fs.existsSync(image.path)) fs.unlinkSync(image.path);
    return res.json({ success: true, content: imageUrl, creation: newCreation });
  } catch (error) {
    console.error("removeImageObject Error:", error.message);
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.json({ success: false, message: error.message });
  }
};


// ✅ Resume Review (PDF Parsing + Gemini AI)
export const resumeReview = async (req, res) => {
  let tempFilePath = null;

  try {
    const { userId } = req.auth?.() || {};
    const resume = req.file;
    const plan = req.plan;

    if (!resume) {
      return res.json({ success: false, message: "No resume file uploaded." });
    }

    // ✅ Always use absolute path
    tempFilePath = path.resolve(resume.path || "");

    // ✅ On Vercel/Render, ensure file is in writable temp dir
    if (!fs.existsSync(tempFilePath)) {
      return res.json({
        success: false,
        message: `Uploaded file not found at: ${tempFilePath}`,
      });
    }

    if (plan !== "premium") {
      fs.unlinkSync(tempFilePath);
      return res.json({
        success: false,
        message: "This feature is only for premium users",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      fs.unlinkSync(tempFilePath);
      return res.json({
        success: false,
        message: "Resume file exceeds 5MB limit.",
      });
    }

    // ✅ Safely parse PDF
    const dataBuffer = fs.readFileSync(tempFilePath);
    const pdfData = await pdf(dataBuffer);

    if (!pdfData.text?.trim()) {
      throw new Error("Could not extract text from PDF. File might be scanned.");
    }

    const prompt = `
You are a professional career advisor.
Review this resume and give detailed, structured, and constructive feedback.
Highlight strengths, weaknesses, and improvement tips for better hiring impact.

Resume Content:
${pdfData.text}
`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content =
      response.choices?.[0]?.message?.content || "No review generated.";

    const [newCreation] = await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Resume Review', ${content}, 'resume-review')
      RETURNING *;
    `;

    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

    return res.json({
      success: true,
      content,
      creation: newCreation,
      message: "Resume reviewed successfully!",
    });
  } catch (error) {
    console.error("resumeReview Error:", error.message);
    if (tempFilePath && fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    return res.json({ success: false, message: error.message });
  }
};
