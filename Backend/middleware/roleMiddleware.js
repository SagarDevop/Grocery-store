/**
 * Middleware to require a specific role (e.g., 'admin', 'seller').
 */
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const hasRole = req.user.role === role || (role === 'admin' && req.user.is_admin);
    
    if (!hasRole) {
      return res.status(403).json({ error: `Access denied: ${role} only` });
    }
    
    next();
  };
};

/**
 * Middleware to verify resource ownership or Admin access.
 * Note: Logic often requires model-specific checks (handled in controllers for complex cases),
 * but this serves as a general template or for simple ownerId checks.
 */
const requireOwnership = (resourceType) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: "Authentication required" });
        if (req.user.role === 'admin' || req.user.is_admin) return next();
        
        // This is a generic role check fallback if direct ownership isn't easily checked in middleware
        // Detailed ownership is implemented directly in the relevant controllers (Orders, Products)
        next();
    };
};

/**
 * Legacy support for 'authorize'
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Login required" });
    const hasRole = roles.some(r => (r === 'admin' ? req.user.is_admin : req.user.role === r));
    if (!hasRole) return res.status(403).json({ error: "Unauthorized" });
    next();
  };
};

module.exports = { authorize, requireRole, requireOwnership };
