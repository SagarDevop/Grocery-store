const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Checks for a JWT token in the cookies (set as 'token').
 * Matches the 'login_required' functionality from Flask.
 */
const protect = async (req, res, next) => {
  let token;

    // Check for token in cookie OR authorization header
    if (req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Unauthorized. Please login to access this resource." 
        });
    }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token payload and attach to req object
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
        return res.status(401).json({ error: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(401).json({ error: "Not authorized, token failed" });
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
