import express from "express";
import protect from "../middlewares/authMiddlewares.js";
import { enhanceJobDescription, enhanceProfessionalSummary, uploadResume } from "../controllers/aiController.js";
const aiRoutes = express.Router();

aiRoutes.post('/enhance-pro-sum', protect, enhanceProfessionalSummary);
aiRoutes.post('/enhance-job-desc', protect, enhanceJobDescription);
aiRoutes.post('/upload-resume', protect, uploadResume);


export default aiRoutes;