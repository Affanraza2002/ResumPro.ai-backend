import express from "express";
import cors from "cors";
import "dotenv/config.js";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import serverless from "serverless-http";

// Create Express app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connect Database
await connectDB();

// Routes
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRoutes);

// Default route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is live!" });
});

// Export as serverless function for Vercel
export const handler = serverless(app);
