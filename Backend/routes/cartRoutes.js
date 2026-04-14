const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// Matches Flask hierarchy
router.get('/:email', protect, cartController.getUserCart);
router.post('/update', protect, cartController.updateUserCart);

module.exports = router;
