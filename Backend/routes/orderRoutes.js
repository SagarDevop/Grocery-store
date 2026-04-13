const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-orders', protect, orderController.getMyOrders);
router.get('/my-orders/:id', protect, orderController.getOrderDetails);
router.get('/seller-orders', protect, orderController.getSellerOrders);
router.put('/status/:id', protect, orderController.updateOrderStatus);
router.post('/checkout', protect, orderController.checkout);

module.exports = router;
