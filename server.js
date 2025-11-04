// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./configs/db.js");

const userRoutes = require("./routes/userRoutes.js");
const resumeRoutes = require("./routes/resumeRoutes.js");
const aiRoutes = require("./routes/aiRoutes.js");

// Load environment variables
dotenv.config();

const app = express();

// ✅ Connect to MongoDB
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
  res.status(200).json({
    success: true,
    message: "ResumePro AI backend is live ✅",
  });
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

// ✅ Start server locally (not in Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// ✅ Export for Vercel
module.exports = app;
