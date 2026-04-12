const mongoose = require('mongoose');

/**
 * AuditLog Schema
 * Tracks every sensitive administrative action for security and accountability.
 */
const AuditLogSchema = new mongoose.Schema({
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String, // e.g., "APPROVE_SELLER", "UPDATE_PRODUCT", "REFUND_ORDER"
    required: true,
  },
  module: {
    type: String, // e.g., "SELLER", "PRODUCT", "FINANCE"
    required: true,
  },
  entity_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  old_value: Object,
  new_value: Object,
  ip_address: String,
  user_agent: String,
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
