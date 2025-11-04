const express = require("express");
const protect = require("../middlewares/authMiddlewares");
const { 
  enhanceJobDescription, 
  enhanceProfessionalSummary, 
  uploadResume 
} = require("../controllers/aiController");

const aiRoutes = express.Router();

aiRoutes.post("/enhance-pro-sum", protect, enhanceProfessionalSummary);
aiRoutes.post("/enhance-job-desc", protect, enhanceJobDescription);
aiRoutes.post("/upload-resume", protect, uploadResume);

module.exports = aiRoutes;
