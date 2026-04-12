const AuditLog = require('../models/AuditLog');

/**
 * Audit Logger Middleware
 * Automatically captures administrative actions for security tracking.
 * @param {String} actionName - The description of the action (e.g., 'APPROVE_SELLER')
 * @param {String} moduleName - The system module (e.g., 'SELLER')
 */
const auditLogger = (actionName, moduleName) => async (req, res, next) => {
    // Capture the original response.json method to log after successful execution
    const originalJson = res.json;

    res.json = function (data) {
        // Only log successful operations
        if (res.statusCode >= 200 && res.statusCode < 300) {
            // We log asynchronously so we don't block the response
            const logEntry = {
                admin_id: req.user?._id,
                action: actionName,
                module: moduleName,
                entity_id: req.params.id || req.body.id || data.id || data.seller_id,
                new_value: req.method === 'GET' ? null : req.body,
                ip_address: req.ip,
                user_agent: req.headers['user-agent'],
            };

            AuditLog.create(logEntry).catch(err => console.error("Audit Logging Failed:", err));
        }

        return originalJson.call(this, data);
    };

    next();
};

module.exports = auditLogger;
