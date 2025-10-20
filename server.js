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
const allowedOrigin = process.env.FRONTEND_URL || "*";
// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser tools (curl, Postman) when origin is undefined
    if (!origin) return callback(null, true);
    if (allowedOrigin === "*" || origin === allowedOrigin) return callback(null, true);
    return callback(new Error("CORS not allowed by server"), false);
  },
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Base route
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend is live ✅" });
});

// API base route messages
app.get("/api/users", (req, res) => {
  res.send("✅ /api/users is live here");
});

app.get("/api/resumes", (req, res) => {
  res.send("✅ /api/resumes is live here");
});

app.get("/api/ai", (req, res) => {
  res.send("✅ /api/ai is live here");
});

// Actual API routes
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
