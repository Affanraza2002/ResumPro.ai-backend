import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import serverless from "serverless-http";

// import userRouter from "./routes/userRoutes.js";
// import resumeRouter from "./routes/resumeRoutes.js";
// import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
// app.use("/api/users", userRouter);
// app.use("/api/resumes", resumeRouter);
// app.use("/api/ai", aiRoutes);

// ✅ Root test route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '✅ Server is live in production!',
    environment: process.env.NODE_ENV,
  });
});

// ✅ Export handler for Vercel
export default serverless(app);

// ✅ For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Local server running on port ${PORT}`));
}
