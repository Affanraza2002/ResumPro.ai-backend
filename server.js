import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import serverless from "serverless-http";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// ✅ MongoDB connection — connect only once per cold start
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    // Reuse existing connection
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Prevent long wait
      maxPoolSize: 1, // Keep connections light for serverless
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
};

// ✅ Test route
app.get("/", async (req, res) => {
  try {
    await connectDB(); // ensure connection once
    res.status(200).json({
      success: true,
      message: "✅ Server is live in production!",
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "❌ Database connection failed",
      error: error.message,
    });
  }
});

// ✅ Export for Vercel (serverless)
const handler = serverless(app);
export default async function (req, res) {
  await connectDB();
  return handler(req, res);
}

// ✅ For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Local server running on port ${PORT}`);
  });
}
