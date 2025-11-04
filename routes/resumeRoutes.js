const express = require("express");
const protect = require("../middlewares/authMiddlewares");
const { 
  createResume, 
  deleteResume, 
  getPublicResumeById, 
  getResumeById, 
  updateResume 
} = require("../controllers/resumeController");
const upload = require("../configs/multer");

const resumeRouter = express.Router();

resumeRouter.post("/create", protect, createResume);
resumeRouter.put("/update", upload.single("image"), protect, updateResume);
resumeRouter.delete("/delete/:resumeId", protect, deleteResume);
resumeRouter.get("/get/:resumeId", protect, getResumeById);
resumeRouter.get("/public/:resumeId", getPublicResumeById);

module.exports = resumeRouter;
