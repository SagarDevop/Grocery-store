const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');

/**
 * Get aggregated stats for the Admin Dashboard
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, totalSellers, totalProducts, pendingRequests, totalOrders] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'seller' }),
            Product.countDocuments(),
            User.countDocuments({ sellerStatus: 'PENDING' }),
            Order.countDocuments()
        ]);

        const financialSummary = await Transaction.aggregate([
            {
                $group: {
                    _id: null,
                    gmv: { $sum: "$gross_amount" },
                    commission: { $sum: "$commission_amount" }
                }
            }
        ]);

        const platformGMV = financialSummary[0]?.gmv || 0;
        const platformComm = financialSummary[0]?.commission || 0;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const salesTrend = await Transaction.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo }, type: 'SALE' } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    gmv: { $sum: "$gross_amount" },
                    commission: { $sum: "$commission_amount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const salesData = salesTrend.map(item => ({
            name: item._id.split('-').slice(1).join('/'), // MM/DD
            gmv: item.gmv,
            commission: item.commission
        }));

        // Remove latency check as it requires admin/ping permissions which may be restricted
        const latency = "N/A";

        res.status(200).json({
            stats: [
                { id: 1, label: 'Platform GMV', value: `₹${platformGMV.toLocaleString()}`, trend: 0, type: 'currency' },
                { id: 2, label: 'Commission (10%)', value: `₹${platformComm.toLocaleString()}`, trend: 0, type: 'currency' },
                { id: 3, label: 'Vendor Network', value: totalSellers.toString(), trend: 0, type: 'number' },
                { id: 4, label: 'Pending Approvals', value: pendingRequests.toString(), trend: 0, type: 'number' },
            ],
            salesData: salesData.length > 0 ? salesData : [
                { name: 'Mon', gmv: 0, commission: 0 },
                { name: 'Tue', gmv: 0, commission: 0 },
                { name: 'Wed', gmv: 0, commission: 0 },
                { name: 'Thu', gmv: 0, commission: 0 },
                { name: 'Fri', gmv: 0, commission: 0 },
                { name: 'Sat', gmv: 0, commission: 0 },
                { name: 'Sun', gmv: 0, commission: 0 },
            ],
            totalProducts,
            systemHealth: {
                status: 'operational',
                uptime: `${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m`,
                latency: `${latency}ms`
            }
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get recent platform activity
 */
exports.getDashboardActivity = async (req, res) => {
    try {
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
        const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(3);

        const activity = [
            ...recentUsers.map(u => ({
                id: u._id,
                type: 'USER_SIGNUP',
                message: `New user joined: ${u.name}`,
                time: u.createdAt,
            })),
            ...recentProducts.map(p => ({
                id: p._id,
                type: 'PRODUCT_ADDED',
                message: `New product added: ${p.name}`,
                time: p.createdAt,
            }))
        ].sort((a, b) => b.time - a.time).slice(0, 8);

        res.status(200).json(activity);
    } catch (error) {
        console.error("Recent Activity Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * List all active/verified sellers
 */
exports.getSellers = async (req, res) => {
    try {
        const sellers = await User.find({ role: 'seller' }).sort({ createdAt: -1 });
        res.status(200).json(sellers);
    } catch (error) {
        console.error("Fetch Sellers Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * List all pending sellers
 */
exports.getPendingSellers = async (req, res) => {
    try {
        const pending = await User.find({ sellerStatus: 'PENDING' });
        res.status(200).json(pending);
    } catch (error) {
        console.error("Fetch Pending Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Approve a pending seller
 */
exports.approveSeller = async (req, res) => {
    try {
        const sellerId = req.params.id;
        const user = await User.findById(sellerId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.role = 'seller';
        user.sellerStatus = 'ACTIVE';
        user.sellerApprovedAt = Date.now();
        await user.save();

        res.status(200).json({ message: "Seller approved successfully", id: sellerId });
    } catch (error) {
        console.error("Approve Seller Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Reject a pending seller
 */
exports.rejectSeller = async (req, res) => {
    try {
        const sellerId = req.params.id;
        const user = await User.findById(sellerId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.sellerStatus = 'REJECTED';
        await user.save();

        res.status(200).json({ message: "Seller rejected", id: sellerId });
    } catch (error) {
        console.error("Reject Seller Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * List all users with basic pagination
 */
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error("Fetch Users Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * List all orders platform-wide
 */
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user_id', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Fetch All Orders Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Fetch all platform security/audit logs
 */
exports.getActivityLogs = async (req, res) => {
    try {
        const AuditLog = require('../models/AuditLog');
        const logs = await AuditLog.find()
            .populate('admin_id', 'name email')
            .sort({ createdAt: -1 })
            .limit(100);
        res.status(200).json(logs);
    } catch (error) {
        console.error("Fetch Audit Logs Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Update user role/admin status
 */
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_admin, role } = req.body;
        
        const user = await User.findByIdAndUpdate(id, { is_admin, role }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ message: "User updated", user });
    } catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = exports;
