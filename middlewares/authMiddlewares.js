import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // ✅ Handle both "Bearer <token>" and raw "<token>"
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach userId from decoded token for route access
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
  }
};

export default protect;
  