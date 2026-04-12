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
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
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
  },
  description: {
    type: String,
  },
  images: [String], // Array of image URLs
  created_at: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
