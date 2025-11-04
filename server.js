// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./configs/db.js");

dotenv.config();
const app = express();

console.log("🚀 Starting Express setup...");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

console.log("✅ Middleware loaded.");

// Connect MongoDB
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

module.exports = app;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
