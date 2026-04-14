const mongoose = require('mongoose');

/**
 * PendingUser Schema
 * Temporary storage for users in the signup process before OTP verification.
 * In Flask, these had a 1-minute TTL. We'll implement TTL using Mongoose.
 */
const PendingUserSchema = new mongoose.Schema({
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
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otp_expiry: {
    type: Date,
    required: true,
    // Note: We'll also use MongoDB TTL index for auto-deletion
    expires: 300 // OTP Expired after 5 minutes (300 seconds)
  },
  otp_attempts: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Alternatively, let's match the exact Flask logic where expiry was a fixed time
module.exports = mongoose.model('PendingUser', PendingUserSchema);
