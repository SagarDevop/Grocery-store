const mongoose = require('mongoose');

/**
 * Order Schema
 * Tracks the lifecycle of a marketplace order involving multiple sellers.
 */
const OrderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
      name: String,
      price: Number,
      quantity: Number,
      status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'],
        default: 'PENDING'
      }
    }
  ],
  total_amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PLACED',
  },
  payment_status: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'PENDING',
  },
  shipping_address: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  timeline: [
    {
      status: String,
      comment: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
