const mongoose = require('mongoose');

/**
 * Wishlist Schema
 */
const WishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
