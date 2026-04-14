const crypto = require('crypto');

/**
 * Generates a random 6-digit OTP string.
 * Uses cryptographically secure randomInt to prevent predictability.
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

module.exports = generateOTP;
