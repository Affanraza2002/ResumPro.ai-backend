// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./configs/db.js");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

(async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
})();

app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend is running ✅" });
});

app.use("/api/users", require("./routes/userRoutes.js"));
app.use("/api/resume", require("./routes/resumeRoutes.js"));
app.use("/api/ai", require("./routes/aiRoutes.js"));

// ⚠️ DO NOT LISTEN HERE IN VERCEL
// Only export the app
module.exports = app;
