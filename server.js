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
const allowedOrigin = process.env.FRONTEND_URL || "*";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ MongoDB Connection
let isConnected = false;
const connectDB = async () => {
  if (isConnected) {
    console.log("⚡ Using existing MongoDB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = conn.connections[0].readyState === 1;
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
};

// ✅ Routes
app.get("/", async (req, res) => {
  await connectDB();
  res.json({
    success: true,
    message: "✅ Backend working perfectly on Vercel!",
    frontend: process.env.FRONTEND_URL,
  });
});

app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

// ✅ Export for Vercel
const handler = serverless(app);
export default async function mainHandler(req, res) {
  await connectDB();
  return handler(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ Local Dev Support
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Local server running on port ${PORT}`);
  });
}
