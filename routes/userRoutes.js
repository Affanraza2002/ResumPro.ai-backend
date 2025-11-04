const express = require("express");
const {
  getUserById,
  getUserResumes,
  loginUser,
  registerUser,
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddlewares");

const userRouter = express.Router();

// Simple test route
userRouter.post("/register", async (req, res) => {
  res.json({ success: true, message: "User registered route works ✅" });
});

userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUserById);
userRouter.get("/resumes", protect, getUserResumes);

module.exports = userRouter;
