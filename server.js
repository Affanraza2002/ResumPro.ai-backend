// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// Import DB connector that does fail-fast validation
import connectDB from "./config/db.js";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// --- Middleware ---
const allowedOrigin = process.env.FRONTEND_URL || "*";

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools (curl, Postman) when origin is undefined
      if (!origin) return callback(null, true);
      if (allowedOrigin === "*" || origin === allowedOrigin) return callback(null, true);
      return callback(new Error("CORS not allowed by server"), false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// --- Connect to MongoDB (fail-fast if bad config) ---
(async () => {
  try {
    await connectDB(); // connectDB reads process.env.MONGODB_URI internally
    // If connectDB exits process on failure, below code won't run
  } catch (err) {
    // connectDB already logs and exits on error; this is defensive
    console.error("Fatal error connecting to DB:", err.message);
    process.exit(1);
  }
})();

// --- Health & quick base routes ---
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend is live ✅" });
});

app.get("/api/users", (req, res) => {
  res.json({ success: true, message: "✅ /api/users is live here" });
});

app.get("/api/resumes", (req, res) => {
  res.json({ success: true, message: "✅ /api/resumes is live here" });
});

app.get("/api/ai", (req, res) => {
  res.json({ success: true, message: "✅ /api/ai is live here" });
});

// --- Actual API routes ---
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiRoutes);

// --- 404 handler for unknown routes ---
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

// --- Central error handler ---
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack || err.message || err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// --- Graceful shutdown handlers ---
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  // optional: close server and exit
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Closing server...");
  server.close(() => {
    console.log("HTTP server closed.");
    // close mongoose connection if you want:
    // import mongoose dynamically here to close connection
    process.exit(0);
  });
});

export default app;
