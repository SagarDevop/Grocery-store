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
    enum: ['user', 'seller'],
    default: 'user',
  },
  phone: {
    type: String,
  },
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
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
