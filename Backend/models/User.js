const mongoose = require('mongoose');

/**
 * User Schema
 * This matches the structure in the Flask 'users' collection.
 */
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() {
      // Password is only required if the user didn't sign up using Google
      return !this.googleId;
    },
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values for normal email users
  },
  profileImage: {
    type: String,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user',
  },
  phone: {
    type: String,
  },
  // --- Seller Specific Fields ---
  storeName: {
    type: String,
  },
  storeDescription: {
    type: String,
  },
  storeCity: {
    type: String,
  },
  sellerStatus: {
    type: String,
    enum: ['PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED'],
    default: 'PENDING',
  },
  commission_rate: {
    type: Number,
    default: 10,
  },
  sellerRating: {
    type: Number,
    default: 0,
  },
  totalSellerSales: {
    type: Number,
    default: 0,
  },
  sellerApprovedAt: {
    type: Date,
  },
  verification_docs: [
    {
      doc_type: String,
      url: String,
      status: { type: String, default: 'PENDING' }
    }
  ],
  // --- End Seller Fields ---
  addresses: [
    {
      label: { type: String, default: 'Home' }, // Home, Office, etc.
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zip: { type: String },
      isDefault: { type: Boolean, default: false }
    }
  ],
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 },
      image: String
    }
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  recently_viewed: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  reset_otp: {
    type: String,
  },
  reset_otp_expiry: {
    type: Date,
  },
  reset_otp_attempts: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
