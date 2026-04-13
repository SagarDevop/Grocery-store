const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-payment-order', protect, paymentController.createPaymentOrder);
router.post('/verify-payment', protect, paymentController.verifyPayment);

module.exports = router;
