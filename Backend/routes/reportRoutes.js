const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/admin/export-report', protect, adminOnly, reportController.exportAdminReport);
router.get('/seller/export-report/:sellerId', protect, authorize('seller'), reportController.exportSellerReport);

module.exports = router;
