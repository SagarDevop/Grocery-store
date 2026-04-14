const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const generateOTP = require('../utils/generateOTP');
const { sendOtpEmailSignup, sendOtpEmailForgotPassword } = require('../services/emailService');
const admin = require('../config/firebase-admin');

/**
 * Handle user signup
 * Generates OTP, sends email, and stores in PendingUser
 */
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Check if verification already in progress
    const existingPending = await PendingUser.findOne({ email });
    if (existingPending) {
      if (new Date() > existingPending.otp_expiry) {
        await PendingUser.deleteOne({ email });
      } else {
        return res.status(409).json({ error: "A verification is already in progress" });
      }
    }

    // Generate OTP and Hash password/OTP
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpExpiry = new Date(Date.now() + 5 * 60000); // Increased to 5 minutes for better UX

    // Send OTP via Brevo (Send PLATIN OTP, not hashed)
    const emailSent = await sendOtpEmailSignup(email, otp);
    if (!emailSent) {
      return res.status(500).json({ error: "Failed to send OTP email" });
    }

    // Create entry in PendingUser with hashed OTP
    await PendingUser.create({
      name,
      email,
      password: hashedPassword,
      otp: hashedOtp,
      otp_expiry: otpExpiry
    });

    res.status(201).json({ message: "OTP sent to your email. Please verify." });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Verify OTP and create active user
 */
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const pending = await PendingUser.findOne({ email });
    if (!pending) {
      return res.status(404).json({ error: "No pending signup found" });
    }

    if (new Date() > pending.otp_expiry) {
      await PendingUser.deleteOne({ email });
      return res.status(400).json({ error: "OTP expired. Please sign up again." });
    }

    const isOtpValid = await bcrypt.compare(otp, pending.otp);
    if (!isOtpValid) {
      pending.otp_attempts += 1;
      await pending.save();

      if (pending.otp_attempts >= 5) {
        await PendingUser.deleteOne({ email });
        return res.status(403).json({ error: "Too many failed attempts. Your registration has been cleared. Please sign up again." });
      }

      return res.status(400).json({ error: `Invalid OTP. ${5 - pending.otp_attempts} attempts remaining.` });
    }

    // Create active user
    const newUser = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      is_verified: true,
      cart: []
    });

    // Cleanup pending record
    await PendingUser.deleteOne({ email });

    res.status(200).json({
      message: "Account verified successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        is_admin: false,
        role: "user"
      }
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * User login
 * Issues a JWT token in an HttpOnly cookie
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate password
    if (!user.password) {
      return res.status(401).json({ error: "Email registered via Google. Please use Google Login." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.is_verified) {
        return res.status(403).json({ error: "Please verify your account first." });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Set JWT in cookie
    res.cookie('token', token, {
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin || false,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Handle password reset request
 */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiry = new Date(Date.now() + 5 * 60000); // 5 minutes

    user.reset_otp = hashedOtp;
    user.reset_otp_expiry = expiry;
    await user.save();

    if (await sendOtpEmailForgotPassword(email, otp)) {
      res.status(200).json({ message: "OTP sent to your email" });
    } else {
      res.status(500).json({ error: "Failed to send OTP" });
    }
  } catch (error) {
    console.error("Forgot PW Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Verify recovery OTP and update password
 */
exports.resetPassword = async (req, res) => {
  const { email, otp, new_password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.reset_otp) {
        return res.status(400).json({ error: "No reset request pending" });
    }

    const isOtpValid = await bcrypt.compare(otp, user.reset_otp);
    if (!isOtpValid) {
      user.reset_otp_attempts += 1;
      await user.save();

      if (user.reset_otp_attempts >= 5) {
        user.reset_otp = undefined;
        user.reset_otp_expiry = undefined;
        user.reset_otp_attempts = 0;
        await user.save();
        return res.status(403).json({ error: "Too many failed attempts. This OTP has been invalidated. Please request a new one." });
      }

      return res.status(400).json({ error: `Invalid OTP. ${5 - user.reset_otp_attempts} attempts remaining.` });
    }

    if (new Date() > user.reset_otp_expiry) {
      return res.status(400).json({ error: "OTP expired" });
    }

    user.password = await bcrypt.hash(new_password, 10);
    user.reset_otp = undefined;
    user.reset_otp_expiry = undefined;
    user.reset_otp_attempts = 0;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset PW Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Handle Google Login (Firebase)
 */
exports.googleLogin = async (req, res) => {
    const { token: idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ error: "No token provided" });
    }

    try {
        let decodedToken;
        try {
            decodedToken = await admin.auth().verifyIdToken(idToken);
        } catch (verifyError) {
            console.error("Firebase Token Verify Error:", verifyError.message);
            return res.status(401).json({ error: "Invalid Google token" });
        }

        const { email, name, picture, uid } = decodedToken;

        let user = await User.findOne({ 
            $or: [ { googleId: uid }, { email: email } ] 
        });

        if (!user) {
            console.log(`🆕 Creating new Google user: ${email}`);
            user = await User.create({
                name: name || "Google User",
                email: email,
                googleId: uid,
                profileImage: picture,
                is_verified: true,
                role: "user",
                cart: []
            });
        } else {
            if (!user.googleId) user.googleId = uid;
            if (!user.profileImage) user.profileImage = picture;
            await user.save();
        }

        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
          });
  
          res.status(200).json({
              message: "Google login successful",
              token: jwtToken,
              user: {
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  is_admin: user.is_admin || false,
                  role: user.role,
                  profileImage: user.profileImage
              }
          });
  
      } catch (error) {
          console.error("Google Login Controller Error:", error);
          res.status(500).json({ error: "Authentication failed" });
      }
  };
