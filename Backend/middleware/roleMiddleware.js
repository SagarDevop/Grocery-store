/**
 * Role-based Authorization Middleware
 * Ensures the user has the required role (e.g., admin, seller).
 * This replaces role checks like `if not user.is_admin` in Flask.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // We check req.user which was attached by 'protect' middleware
    if (!req.user) {
      return res.status(401).json({ error: "Login required" });
    }

    const { role, is_admin } = req.user;

    // Special check for admin: if the role is 'admin', it checks 'is_admin' property
    const hasRole = roles.some(r => {
      if (r === 'admin') return is_admin === true;
      return role === r;
    });

    if (!hasRole) {
      return res.status(403).json({ error: `User role '${role}' is not authorized to access this route` });
    }
    
    next();
  };
};

module.exports = { authorize };
