import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // ✅ Handle "Bearer <token>" or raw token
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("❌ Auth Error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default protect;
