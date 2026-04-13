const express = require('express');
const router = express.Router();
const growthController = require('../controllers/growthController');
const { protect } = require('../middleware/authMiddleware');

router.get('/recommendations', protect, growthController.getRecommendations);
router.get('/quick-reorder', protect, growthController.getQuickReorder);

module.exports = router;
