import express from 'express';
import {
  getUserById,
  getUserResumes,
  loginUser,
  registerUser
} from '../controllers/userController.js';
import protect from '../middlewares/authMiddlewares.js';

const userRouter = express.Router();

// Simple test route
userRouter.post("/register", async (req, res) => {
  res.json({ success: true, message: "User registered route works ✅" });
});

userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUserById);
userRouter.get('/resumes', protect, getUserResumes);

export default userRouter;
