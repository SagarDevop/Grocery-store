const express = require('express');
const router = express.Router();
const { getDashboardStats, getDashboardActivity, approveSeller, rejectSeller, getPendingSellers, getSellers } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const auditLogger = require('../middleware/auditLogger');

/**
 * All admin routes are protected by JWT and is_admin check
 * Reusing authorize('admin') where applicable, but fits the existing core structure.
 */
// Dashboard Stats & Activity (Frontend expects /admin prefix)
router.get('/admin/stats', protect, adminOnly, getDashboardStats);
router.get('/admin/activity', protect, adminOnly, getDashboardActivity);

// Seller Management (Pending & Active Lists)
router.get('/pending-sellers', protect, adminOnly, getPendingSellers);
router.get('/sellers', protect, adminOnly, getSellers);

// Seller Management Actions (Audited & Parameterized as per api/auth.js)
router.post('/approve-seller/:id', protect, adminOnly, auditLogger('APPROVE_SELLER', 'SELLER'), approveSeller);
router.delete('/reject-seller/:id', protect, adminOnly, auditLogger('REJECT_SELLER', 'SELLER'), rejectSeller);

module.exports = router;
