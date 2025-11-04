// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.js";

import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

// ✅ Connect MongoDB only once
await connectDB();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup for production + local dev
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
    credentials: true,
  })
);

// ✅ Health route
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "ResumePro AI backend is live ✅" });
});

// ✅ API routes
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

// ✅ Global error handler (no crashes on Vercel)
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.message || err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ✅ Export for Vercel serverless runtime
export default app;
