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

// ✅ Use async DB connect inside a function, no top-level await
(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://resumpro-ai-frontend.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked for:", origin);
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

// ✅ Health check route
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "ResumePro AI backend is live ✅" });
});

// ✅ API routes
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.message || err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ✅ Export only app (not serverless wrapper)
export default app;
