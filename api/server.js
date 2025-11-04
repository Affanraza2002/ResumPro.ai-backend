import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";

// ✅ Load .env variables
dotenv.config();

// ✅ Import routes (relative to this file)
import userRoutes from "../routes/userRoutes.js";
import resumeRoutes from "../routes/resumeRoutes.js";
import aiRoutes from "../routes/aiRoutes.js";

const app = express();

// ✅ CORS setup
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://resumpro-ai-frontend.vercel.app",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.log("❌ CORS blocked for:", origin);
      return callback(new Error("CORS not allowed by server"), false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.options("*", cors());
app.use(express.json());

// ✅ Optimized MongoDB connection for serverless
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = conn.connections[0].readyState;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
};
connectDB();

// ✅ Base route
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend is live ✅" });
});

// ✅ API routes
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

// ✅ Export for Vercel serverless functions
export const handler = serverless(app);
export default app;
