const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ===============================
// Protect Middleware
// ===============================
exports.protect = async (req, res, next) => {
  let token;

  // 1️⃣ Check Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2️⃣ If not found, check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // 3️⃣ If no token found, reject access
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5️⃣ Attach user to request object (without password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 6️⃣ Continue to next middleware or route
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed or expired",
    });
  }
};

// ===============================
// Generate JWT Token
// ===============================
exports.getSignedJwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
