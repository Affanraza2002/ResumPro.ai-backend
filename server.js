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

// ✅ CORS setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ MongoDB Connection
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log("⚡ Using existing MongoDB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
    });
    cachedConnection = conn;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
};

// ✅ Root route
app.get("/", async (req, res) => {
  try {
    await connectDB();
    res.status(200).json({
      success: true,
      message: "✅ Backend + MongoDB connected on Vercel",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "❌ Failed to connect MongoDB",
      error: err.message,
    });
  }
});

// ✅ API routes
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

// ✅ Export handler for Vercel
const handler = serverless(app);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handlerWrapper(req, res) {
  await connectDB();
  return handler(req, res);
}

// ✅ Local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Local server running on port ${PORT}`);
  });
}
