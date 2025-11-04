// controllers/userController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Resume = require("../models/Resume");

// ✅ Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "10d" });
};

// ✅ Register User
// POST : /api/users/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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
      token,
    });
  } catch (error) {
    console.error("❌ registerUser error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// ✅ Login User
// POST : /api/users/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      message: "User Login Successfully",
      token,
      user: userObj,
    });
  } catch (error) {
    console.error("❌ loginUser error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// ✅ Get User by ID
// GET : /api/users/data
exports.getUserById = async (req, res) => {
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

// ✅ Get All Resumes of a User
// GET : /api/users/resumes
exports.getUserResumes = async (req, res) => {
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
