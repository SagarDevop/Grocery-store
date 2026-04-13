const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRequest, signupSchema, loginSchema } = require('../middleware/validation');

// All these routes match the Flask implementation exactly
router.post('/signup', validateRequest(signupSchema), authController.signup);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/google-login', authController.googleLogin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
