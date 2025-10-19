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

// ✅ MongoDB connection caching
let isConnected = false;
async function connectDB() {
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
  }
}

// ✅ Routes
app.get("/", async (req, res) => {
  try {
    await connectDB();
    res.status(200).json({
      success: true,
      message: "✅ Backend + MongoDB working on Vercel!",
      frontend: process.env.FRONTEND_URL,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "❌ Failed to connect to MongoDB",
      error: err.message,
    });
  }
});

app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

// ✅ Create handler *outside* export
const handler = serverless(app);

// ✅ Correct Vercel export (return the awaited handler)
const vercelHandler = async (req, res) => {
  await connectDB();
  return handler(req, res);
};

export default vercelHandler;

export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ Local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Local server running on port ${PORT}`);
  });
}
