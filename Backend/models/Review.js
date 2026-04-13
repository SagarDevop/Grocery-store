const mongoose = require('mongoose');

/**
 * Review Schema
 * Stores customer feedback and ratings.
 * Strictly linked to orders to ensure only real buyers can review.
 */
const ReviewSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

// Prevent duplicate reviews from the same user for the same product in the same order
ReviewSchema.index({ user_id: 1, product_id: 1, order_id: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
