const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const Seller = require('../models/Seller');
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
      // Check if expired (Flask logic: datetime.utcnow() > existing_pending["otp_expiry"])
      if (new Date() > existingPending.otp_expiry) {
        await PendingUser.deleteOne({ email });
      } else {
        return res.status(409).json({ error: "A verification is already in progress" });
      }
    }

    // Generate OTP and Hash password
    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpExpiry = new Date(Date.now() + 1 * 60000); // 1 minute

    // Send OTP via Brevo
    const emailSent = await sendOtpEmailSignup(email, otp);
    if (!emailSent) {
      return res.status(500).json({ error: "Failed to send OTP email" });
    }

    // Create entry in PendingUser
    await PendingUser.create({
      name,
      email,
      password: hashedPassword,
      otp,
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

    if (pending.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
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
    // Check in Users and Sellers (Flask checks both)
    const user = await User.findOne({ email });
    const seller = await Seller.findOne({ email });

    const target = user || seller;

    if (!target) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate password
    if (!target.password) {
      return res.status(401).json({ error: "Email registered via Google. Please use Google Login." });
    }

    const isMatch = await bcrypt.compare(password, target.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check verification (Flask: if not user.get("is_verified", False))
    // Note: Sellers in the Flask app seemed to imply they are verified if they exist in sellers_collection
    if (user && !user.is_verified) {
        return res.status(403).json({ error: "Please verify your account first." });
    }

    // Determine role (Flask logic: role = "seller" if seller else "user")
    const role = seller ? "seller" : (user.is_admin ? "admin" : "user");

    // Generate JWT
    const token = jwt.sign({ id: target._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Set JWT in cookie
    res.cookie('token', token, {
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: target._id,
        name: target.name,
        email: target.email,
        is_admin: user ? user.is_admin : false,
        role: role
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
    const expiry = new Date(Date.now() + 1 * 60000); // 1 minute

    user.reset_otp = otp;
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
    if (!user || user.reset_otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (new Date() > user.reset_otp_expiry) {
      return res.status(400).json({ error: "OTP expired" });
    }

    user.password = await bcrypt.hash(new_password, 10);
    user.reset_otp = undefined;
    user.reset_otp_expiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset PW Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Handle Google Login (Firebase)
 * 1. Verifies the ID Token from frontend
 * 2. Checks if user exists in MongoDB
 * 3. Creates new user or link existing one
 * 4. Issues JWT cookie
 */
exports.googleLogin = async (req, res) => {
    const { token: idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ error: "No token provided" });
    }

    try {
        // 1. Verify Firebase ID Token
        // NOTE: This will fail if FIREBASE_PROJECT_ID, etc. are not set correctly in .env
        let decodedToken;
        try {
            decodedToken = await admin.auth().verifyIdToken(idToken);
        } catch (verifyError) {
            console.error("Firebase Token Verify Error:", verifyError.message);
            return res.status(401).json({ error: "Invalid Google token" });
        }

        const { email, name, picture, uid } = decodedToken;

        // 2. Check if user exists in MongoDB
        // We prioritizing checking by Google ID, then Email
        let user = await User.findOne({ 
            $or: [ { googleId: uid }, { email: email } ] 
        });

        if (!user) {
            // Check if they are a seller (Flask logic: roles match sellers_collection)
            const seller = await Seller.findOne({ email });
            if (seller) {
                // If they are a seller, link their Google ID if not already there
                if (!seller.googleId) {
                    seller.googleId = uid;
                    await seller.save();
                }
                user = seller;
            } else {
                // Create new basic user
                console.log(`🆕 Creating new Google user: ${email}`);
                user = await User.create({
                    name: name || "Google User",
                    email: email,
                    googleId: uid,
                    profileImage: picture,
                    is_verified: true, // Google users are pre-verified
                    role: "user",
                    cart: []
                });
            }
        } else {
            // Update existing user/seller with Google info if missing
            if (!user.googleId) user.googleId = uid;
            if (!user.profileImage) user.profileImage = picture;
            await user.save();
        }

        // 3. Issue JWT Token (same as normal login)
        const role = user.role || (user.is_admin ? "admin" : "user");
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Google login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                is_admin: user.is_admin || false,
                role: role,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        console.error("Google Login Controller Error:", error);
        res.status(500).json({ error: "Authentication failed" });
    }
};
