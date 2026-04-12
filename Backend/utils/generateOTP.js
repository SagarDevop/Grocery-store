/**
 * Generates a random 6-digit OTP string.
 * This matches the logic in Flask: str(random.randint(100000, 999999))
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = generateOTP;
