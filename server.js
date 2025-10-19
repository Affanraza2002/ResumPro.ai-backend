import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import serverless from "serverless-http";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// ✅ MongoDB connection — only connect once
let isConnected = false;
const connectDB = async () => {
  if (isConnected) {
    console.log("⚡ Using existing MongoDB connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // ⏳ Avoid long waits
    });
    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw new Error("Database connection failed");
  }
};

// ✅ Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ✅ Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ Server is live in production!",
    environment: process.env.NODE_ENV,
  });
});

// ✅ Export for Vercel (serverless)
export const handler = serverless(app);

// ✅ For local dev
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Local server running on port ${PORT}`)
  );
}
