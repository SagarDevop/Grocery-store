const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public endpoints
router.post('/register-seller', sellerController.registerSeller);
router.post('/notify-new-seller', sellerController.notifyAdminNewSeller);
router.get('/api/current-seller/:email', sellerController.getCurrentSeller);
router.get('/api/profile/:email', sellerController.getProfile);

// Protected endpoints (Admin only)
router.get('/pending-sellers', protect, authorize('admin'), sellerController.getPendingSellers);
router.post('/approve-seller/:seller_id', protect, authorize('admin'), sellerController.approveSeller);
router.delete('/reject-seller/:seller_id', protect, authorize('admin'), sellerController.rejectSeller);

// Seller endpoints
router.get('/api/seller-dashboard-summary', protect, authorize('seller'), sellerController.getSellerSummary);
router.get('/api/seller-products/:sellerId', protect, authorize('seller'), sellerController.getSellerProducts);
router.get('/api/seller-orders/:sellerId', protect, authorize('seller'), sellerController.getSellerOrders);

module.exports = router;
