// backend/middlewares/authMiddlewares.js
import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    // If no Authorization header, try cookies (optional)
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Accept both "Bearer <token>" and raw "<token>"
    if (typeof token === "string" && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // Final sanity check
    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded should contain what you signed (we expect { userId: ... })
    req.userId = decoded.userId || decoded.id || decoded._id;
    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export default protect;
