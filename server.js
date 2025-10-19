import express from "express";
import cors from "cors";
import "dotenv/config.js";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import serverless from "serverless-http";

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is live!" });
});

// Connect DB safely
let isConnected = false;
async function init() {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log("✅ MongoDB connected successfully");
    } catch (err) {
      console.error("❌ Database connection failed:", err);
    }
  }
}

await init();

export const handler = serverless(app);
