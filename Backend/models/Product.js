const mongoose = require('mongoose');

/**
 * Product Schema
 * Represents a grocery item listed by a seller.
 */
const ProductSchema = new mongoose.Schema({
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    index: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number, // Quantity (e.g., 500)
    required: true,
  },
  unit: {
    type: String, // Unit (e.g., g, kg, packet)
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
  },
  images: [String], // Array of image URLs
  averageRating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  totalSales: {
    type: Number, // Tracking conversion volume for trust badges
    default: 0,
    index: -1, // High to low for best sellers
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: -1,
  }
}, { timestamps: true });

// Compound index for category + price (common filter combo)
ProductSchema.index({ category: 1, price: 1 });
// Text index for search
ProductSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
