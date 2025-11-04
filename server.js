// server.js
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import serverless from "serverless-http";

// ✅ Load environment variables
dotenv.config();

import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// ✅ CORS setup
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://resumpro-ai-frontend.vercel.app",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked for:", origin);
        callback(new Error("CORS not allowed by server"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.options("*", cors());
app.use(express.json());

// ✅ MongoDB connection (no deprecated options)
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

// ✅ Base route
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend is live ✅" });
});

// ✅ API routes
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

// ✅ Local development (use npm run dev)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running locally on port ${PORT}`));
}

// ✅ Export handler for Vercel
export const handler = serverless(app);
export default app;
