const mongoose = require('mongoose');

/**
 * Seller Schema
 * Stores details of users who have been approved by the admin to sell products.
 */
const SellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
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
    type: String, // Description of products they sell
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED'],
    default: 'ACTIVE', // Existing sellers are active by default
  },
  commission_rate: {
    type: Number,
    default: 10, // Default 10% commission
  },
  verification_docs: [
    {
      doc_type: String,
      url: String,
      status: { type: String, default: 'PENDING' }
    }
  ],
  role: {
    type: String,
    default: 'seller',
  },
  approved_at: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('Seller', SellerSchema);
