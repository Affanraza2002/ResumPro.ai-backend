import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Root test route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "✅ Express server is live on Vercel!",
    environment: process.env.NODE_ENV,
  });
});

// ✅ Export handler for Vercel
export default app;
