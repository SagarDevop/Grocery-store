const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/validate', protect, couponController.validateCoupon);
router.post('/', protect, authorize('admin'), couponController.createCoupon);
router.get('/active', couponController.getActiveCoupons);

module.exports = router;
