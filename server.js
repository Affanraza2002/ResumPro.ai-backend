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

// ✅ CORS setup (allow only frontend domain)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ MongoDB Connection (optimized for Vercel)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 1,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
};

// ✅ Root route for testing
app.get("/", async (req, res) => {
  try {
    await connectDB();
    res.status(200).json({
      success: true,
      message: "✅ Server + MongoDB are live in production!",
      environment: process.env.NODE_ENV,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "❌ Database connection failed",
      error: err.message,
    });
  }
});

// ✅ API Routes (your app logic)
app.use("/api/users", async (req, res, next) => {
  await connectDB();
  next();
}, userRoutes);

app.use("/api/resumes", async (req, res, next) => {
  await connectDB();
  next();
}, resumeRoutes);

app.use("/api/ai", async (req, res, next) => {
  await connectDB();
  next();
}, aiRoutes);

// ✅ Vercel Serverless Export
const handler = serverless(app);
export default async function (req, res) {
  await connectDB();
  return handler(req, res);
}

// ✅ Local Development (non-Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Local server running on port ${PORT}`);
  });
}
