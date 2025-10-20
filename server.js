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

// ✅ CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ MongoDB connection
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err.message);
  }
}

// ✅ Test route
app.get("/", async (req, res) => {
  await connectDB();
  res.json({ success: true, message: "Backend root OK ✅" });
});

// ✅ API root test route
app.get("/api", async (req, res) => {
  await connectDB();
  res.json({ success: true, message: "API route active ✅" });
});

// ✅ Actual API routes
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

// ✅ For Vercel
const handler = serverless(app);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function mainHandler(req, res) {
  await connectDB();
  return handler(req, res);
}

// ✅ Local dev mode
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}
