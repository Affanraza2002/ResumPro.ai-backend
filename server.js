// backend/server.js
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import serverless from "serverless-http";
import cookieParser from "cookie-parser"; // optional, useful if you use cookies

dotenv.config();

import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

// CORS - allow your deployed frontend and localhost
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://resumpro-ai-frontend.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like Postman or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.log("❌ CORS blocked for:", origin);
      return callback(new Error("CORS not allowed by server"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

// MongoDB connection (no deprecated options)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = conn.connections[0].readyState;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
};
connectDB();

// Base route
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend is live ✅" });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

// Global error handler (so serverless doesn't crash on thrown errors)
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.message || err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Local dev server
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running locally on port ${PORT}`));
}

// Export for Vercel
export const handler = serverless(app);
export default app;
