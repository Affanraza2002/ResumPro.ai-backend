import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import serverless from "serverless-http";

import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Allow your frontend domain
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ MongoDB connection caching
let cachedConnection = null;
async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log("⚡ Using existing MongoDB connection");
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    cachedConnection = conn;
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  }
}

// ✅ Health check route
app.get("/", async (req, res) => {
  try {
    await connectDB();
    return res.status(200).json({
      success: true,
      message: "✅ Backend working correctly on Vercel",
      frontend: process.env.FRONTEND_URL,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "❌ MongoDB connection error",
      error: err.message,
    });
  }
});

// ✅ API routes
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

// ✅ Wrap with serverless handler for Vercel
const handler = serverless(app);

export default async function vercelHandler(req, res) {
  try {
    await connectDB();
    return handler(req, res);
  } catch (err) {
    console.error("❌ Handler error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// ✅ Required by Vercel
export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ Local Development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Local server running on port ${PORT}`);
  });
}
