const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// Matches Flask hierarchy
router.get('/api/cart/:email', cartController.getUserCart);
router.post('/api/cart/update', protect, cartController.updateUserCart);

module.exports = router;
