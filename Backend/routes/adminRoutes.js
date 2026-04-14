const express = require('express');
const router = express.Router();
const { 
    getDashboardStats, 
    getDashboardActivity, 
    approveSeller, 
    rejectSeller, 
    getPendingSellers, 
    getSellers,
    getUsers,
    getAllOrders,
    getActivityLogs,
    updateUser
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const auditLogger = require('../middleware/auditLogger');

/**
 * All admin routes are protected by JWT and is_admin check
 * Reusing authorize('admin') where applicable, but fits the existing core structure.
 */
// Dashboard Stats & Activity (Frontend expects /admin prefix)
// Dashboard Stats & Activity
router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/activity', protect, adminOnly, getDashboardActivity);

// Seller Management (Pending & Active Lists)
router.get('/pending-sellers', protect, adminOnly, getPendingSellers);
router.get('/sellers', protect, adminOnly, getSellers);

// Seller Management Actions
router.post('/approve-seller/:id', protect, adminOnly, auditLogger('APPROVE_SELLER', 'SELLER'), approveSeller);
router.delete('/reject-seller/:id', protect, adminOnly, auditLogger('REJECT_SELLER', 'SELLER'), rejectSeller);

// Admin Global Views
router.get('/users', protect, adminOnly, getUsers);
router.get('/orders/all', protect, adminOnly, getAllOrders);
router.get('/audit-logs', protect, adminOnly, getActivityLogs);
router.put('/user/:id', protect, adminOnly, auditLogger('UPDATE_USER_ROLE', 'USER'), updateUser);

module.exports = router;
