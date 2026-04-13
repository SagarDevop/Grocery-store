const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['PERCENT', 'FLAT'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  expiryDate: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: null // null means unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  usersUsed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    default: null // null means platform-wide
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', CouponSchema);
