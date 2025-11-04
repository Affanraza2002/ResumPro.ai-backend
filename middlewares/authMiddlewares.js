const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    // Check cookies if Authorization header not present
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Handle "Bearer <token>" format
    if (typeof token === "string" && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // Final check
    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId || decoded.id || decoded._id;

    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = protect;
