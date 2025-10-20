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

// ✅ CORS Setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ MongoDB Connection
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
}

// ✅ Health check
app.get("/", async (req, res) => {
  try {
    await connectDB();
    res.json({ success: true, message: "Backend root OK ✅" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ API Test
app.get("/api", async (req, res) => {
  try {
    await connectDB();
    res.json({ success: true, message: "API route working ✅" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Routes
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

// ✅ Main serverless handler for Vercel
const mainHandler = async (req, res) => {
  try {
    await connectDB();
    console.log("⚙️ Handling request:", req.url);
    await handler(req, res); // ✅ FIXED: Added await here
    console.log("✅ Request handled successfully");
  } catch (err) {
    console.error("❌ Server crashed:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

export default mainHandler;

// ✅ Local Development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}
