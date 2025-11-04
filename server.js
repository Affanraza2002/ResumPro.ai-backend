// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./configs/db.js");

// load env
dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// connect db
connectDB();

// test route
app.get("/", (req, res) => {
  res.json({ success: true, message: "ResumePro AI backend is live ✅" });
});

// routes
app.use("/api/users", require("./routes/userRoutes.js"));
app.use("/api/resume", require("./routes/resumeRoutes.js"));
app.use("/api/ai", require("./routes/aiRoutes.js"));

// ✅ Export app (this is required for Vercel)
module.exports = app;

// ✅ Only listen locally (not on Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
