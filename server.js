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

// ✅ MongoDB Connection (initialize once at cold start)
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
await connectDB(); // ✅ connect once at startup (works fine on Vercel)

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend root OK ✅" });
});

// ✅ API Test
app.get("/api", (req, res) => {
  res.json({ success: true, message: "API route working ✅" });
});

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

// ✅ Export for Vercel
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = serverless(app);
export default handler;

// ✅ Local Development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}
