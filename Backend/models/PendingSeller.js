const mongoose = require('mongoose');

/**
 * PendingSeller Schema
 * Stores registration requests that need admin approval.
 */
const PendingSellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  store: {
    type: String,
    required: true,
  },
  products: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('PendingSeller', PendingSellerSchema);
