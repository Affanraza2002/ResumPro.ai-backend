import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import routes
import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://resumpro-ai-frontend.vercel.app",
  "http://localhost:3000" // for local testing
];

// ✅ CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman/curl
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked for origin:", origin);
        callback(new Error("CORS not allowed by server"), false);
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.options("*", cors());
app.use(express.json());

// ✅ MongoDB connection (works on Vercel)
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ✅ Base route check
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend is live ✅" });
});

// ✅ Simple test routes
app.get("/api/users", (req, res) => res.send("✅ /api/users is live here"));
app.get("/api/resumes", (req, res) => res.send("✅ /api/resumes is live here"));
app.get("/api/ai", (req, res) => res.send("✅ /api/ai is live here"));

// ✅ Actual routes
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

// ❌ REMOVE app.listen() — not used on Vercel
// ✅ Instead, export the app for serverless function
export default app;
