const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.get('/products/category/:category_name', productController.getProductsByCategory);
router.get('/categories', productController.getAllCategories);

// Protected routes (Seller only)
router.post('/add-product', protect, authorize('seller'), productController.addProduct);

module.exports = router;
