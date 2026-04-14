const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Checks for a JWT token in the cookies (set as 'token').
 * Matches the 'login_required' functionality from Flask.
 */
const protect = async (req, res, next) => {
  let token;

  // Prioritize Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Fallback to cookie for legacy support if needed
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Unauthorized. Please login." 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token payload and attach to req object
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: "User not found or account deactivated." 
      });
    }

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
        console.error("❌ Auth Signature Error:", error.message);
    } else if (error.name === 'TokenExpiredError') {
        console.warn("⏳ Auth Token Expired");
    } else {
        console.error("🔒 Auth Middleware Error:", error.message);
    }

    res.status(401).json({ 
      success: false, 
      message: "Session expired or invalid token. Please login again." 
    });
  }
};

/**
 * Admin Authorization Middleware
 * Ensures the logged-in user has the 'admin' role.
 */
const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.is_admin)) {
    next();
  } else {
    res.status(403).json({ error: "Access denied: Admin only" });
  }
};

module.exports = { protect, adminOnly };
