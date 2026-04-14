const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest, sellerRegisterSchema } = require('../middleware/validation');
const { authorize } = require('../middleware/roleMiddleware');

// Public endpoints
router.post('/register-seller', validateRequest(sellerRegisterSchema), sellerController.registerSeller);
router.post('/notify-new-seller', sellerController.notifyAdminNewSeller);
router.get('/current-seller/:email', sellerController.getCurrentSeller);
// Protected/Limited endpoints
router.get('/me', protect, sellerController.getProfile);

// Protected endpoints (Admin only)
router.get('/pending-sellers', protect, authorize('admin'), sellerController.getPendingSellers);
router.get('/sellers', protect, authorize('admin'), sellerController.getSellers);
router.post('/approve-seller/:seller_id', protect, authorize('admin'), sellerController.approveSeller);
router.delete('/reject-seller/:seller_id', protect, authorize('admin'), sellerController.rejectSeller);

// Seller endpoints (Session-bound)
router.get('/dashboard-summary', protect, authorize('seller'), sellerController.getSellerSummary);
router.get('/products/:seller_id', protect, authorize('seller'), sellerController.getSellerProducts);
router.get('/orders/:seller_id', protect, authorize('seller'), sellerController.getSellerOrders);

module.exports = router;
