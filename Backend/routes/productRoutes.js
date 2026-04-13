const express = require('express');
const router = express.Router();
const { 
  getAllProducts, 
  getProductById, 
  getProductsByCategory, 
  getAllCategories, 
  addProduct,
  getPopularProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { trackRecentlyViewed } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateRequest, productSchema } = require('../middleware/validation');
const cache = require('../middleware/cacheMiddleware');

// Public routes
router.get('/', cache(300), getAllProducts); // Cache for 5 mins
router.get('/categories', cache(3600), getAllCategories); // Cache for 1 hour
router.get('/category/:category_name', cache(300), getProductsByCategory);
router.get('/popular', cache(600), getPopularProducts);
router.get('/:id', trackRecentlyViewed, getProductById);

// Seller/Vendor routes (Requires specific role in production)
router.post('/', protect, authorize('seller'), validateRequest(productSchema), addProduct);
router.put('/:id', protect, authorize('seller'), updateProduct);
router.delete('/:id', protect, authorize('seller'), deleteProduct);

module.exports = router;
