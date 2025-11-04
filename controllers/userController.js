// backend/controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "10d" });
};

// POST : /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(newUser._id);
    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(201).json({
      message: "User Created Successfully",
      user: userObj,
      token, // raw token (frontend can store as-is)
    });
  } catch (error) {
    console.error("❌ registerUser error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// POST : /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // compare passwords correctly
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      message: "User Login Successfully",
      token, // raw token string
      user: userObj,
    });
  } catch (error) {
    console.error("❌ loginUser error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// GET : /api/users/data
export const getUserById = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("❌ getUserById error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// GET : /api/users/resumes
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const resumes = await Resume.find({ userId });
    return res.status(200).json({ resumes });
  } catch (error) {
    console.error("❌ getUserResumes error:", error);
    return res.status(400).json({ message: error.message });
  }
};
