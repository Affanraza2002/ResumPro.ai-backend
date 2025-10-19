import express from "express";
import serverless from "serverless-http";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Express is running on Vercel!",
  });
});

export default serverless(app);
