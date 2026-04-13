const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Review Routes
 * Base path: /api/reviews
 */

// Post a new review (Requires Authentication)
router.post('/', protect, reviewController.addReview);

// Get reviews for a specific product (Public)
router.get('/product/:productId', reviewController.getProductReviews);

// Delete a review (User or Admin)
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router;
