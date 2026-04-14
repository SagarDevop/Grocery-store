const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const Cart = require('../models/Cart');
const { sendSellerEmail, sendAdminNotificationNewSeller } = require('../services/emailService');

/**
 * Submit a request to become a seller
 */
exports.registerSeller = async (req, res) => {
  const { name, phone, email, city, store, products } = req.body;

  if (!name || !phone || !email || !city || !store) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found. Please sign up first." });
    }

    user.storeName = store;
    user.storeCity = city;
    user.storeDescription = products;
    user.phone = phone;
    user.sellerStatus = 'PENDING';
    await user.save();

    res.status(200).json({ 
      message: "Registration successful. Admin will review soon.",
      user_id: user._id.toString()
    });
  } catch (error) {
    console.error("Register Seller Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Handle notification for a new seller request
 */
exports.notifyAdminNewSeller = async (req, res) => {
  try {
    await sendAdminNotificationNewSeller(req.body);
    res.status(200).json({ message: "Admin notified" });
  } catch (error) {
    console.error("Notify Admin Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get all pending seller requests (Admin only)
 */
exports.getPendingSellers = async (req, res) => {
  try {
    const pending = await User.find({ sellerStatus: 'PENDING' });
    res.status(200).json(pending);
  } catch (error) {
    console.error("Get Pending Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Approve a seller (Admin only)
 */
exports.approveSeller = async (req, res) => {
  const { seller_id } = req.params;

  try {
    const user = await User.findById(seller_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.role = 'seller';
    user.sellerStatus = 'ACTIVE';
    user.sellerApprovedAt = Date.now();
    await user.save();

    await sendSellerEmail(user.email, "approved", user.name);

    res.status(200).json({ message: "Seller approved", seller_id: user._id.toString() });
  } catch (error) {
    console.error("Approve Seller Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Reject a seller request (Admin only)
 */
exports.rejectSeller = async (req, res) => {
  const { seller_id } = req.params;

  try {
    const user = await User.findById(seller_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.sellerStatus = 'REJECTED';
    await user.save();

    await sendSellerEmail(user.email, "rejected", user.name);

    res.status(200).json({ message: "Seller rejected" });
  } catch (error) {
    console.error("Reject Seller Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


/**
 * Get current authenticated user/seller profile
 */
exports.getProfile = async (req, res) => {
    try {
      // Identity securely extracted from JWT in authMiddleware
      const user = await User.findById(req.user._id)
        .select('name email role is_admin profileImage phone storeName storeCity storeDescription sellerStatus sellerRating');
  
      if (!user) {
        return res.status(404).json({ error: "Profile not found" });
      }
 
      // Fetch associated cart
      const userCart = await Cart.findOne({ userId: user._id }).populate('items.productId');
      const profile = user.toObject();
      profile.cart = userCart ? userCart.items : [];
 
      res.status(200).json(profile);
    } catch (error) {
      console.error("Fetch Profile Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Seller Dashboard Summary
 */
exports.getSellerSummary = async (req, res) => {
  // Identity securely derived from session, ignoring any query params
  const sellerId = req.user._id;

  try {
    const mongoose = require('mongoose');
    const sId = new mongoose.Types.ObjectId(sellerId);

    // 1. Total Products
    const totalProducts = await Product.countDocuments({ seller_id: sId });

    // 2. Earnings Aggregation from Transactions
    const earningsResult = await Transaction.aggregate([
      { $match: { seller_id: sId, type: 'SALE', status: 'COMPLETED' } },
      { $group: { _id: null, total: { $sum: "$net_amount" } } }
    ]);
    const earnings = earningsResult[0]?.total || 0;

    // 3. Orders Count
    const ordersCount = await Order.countDocuments({ "items.seller_id": sId });

    // 4. Pending Orders Count
    const pendingOrdersCount = await Order.countDocuments({ 
      "items.seller_id": sId,
      status: { $in: ['PLACED', 'PROCESSING'] }
    });

    // 5. Sales Trend (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const salesTrend = await Transaction.aggregate([
      { 
        $match: { 
          seller_id: sId, 
          createdAt: { $gte: sevenDaysAgo },
          type: 'SALE',
          status: 'COMPLETED'
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: "$net_amount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const formattedTrend = salesTrend.map(item => ({
      name: item._id.split('-').slice(2).join('/'), // DD
      sales: item.sales
    }));

    // 6. Recent Notifications
    const notifications = [
      `You have ${totalProducts} active products in catalog.`,
      `Lifetime earnings reached ₹${earnings.toLocaleString()}.`,
      `${ordersCount} total orders processed by your store.`
    ];

    res.status(200).json({
      totalProducts,
      orders: ordersCount,
      earnings: earnings,
      pendingOrders: pendingOrdersCount,
      notifications: notifications,
      salesTrend: formattedTrend.length > 0 ? formattedTrend : [
        { name: 'Mon', sales: 0 },
        { name: 'Tue', sales: 0 },
        { name: 'Wed', sales: 0 },
        { name: 'Thu', sales: 0 },
        { name: 'Fri', sales: 0 },
        { name: 'Sat', sales: 0 },
        { name: 'Sun', sales: 0 }
      ]
    });
  } catch (error) {
    console.error("Seller Summary Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get all products for a specific seller
 */
exports.getSellerProducts = async (req, res) => {
    try {
        const sellerId = req.params.seller_id || req.user._id;
        const products = await Product.find({ seller_id: sellerId }).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error("Fetch Seller Products Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get all orders containing products from a specific seller
 */
exports.getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.params.seller_id || req.user._id;
        
        const orders = await Order.find({
            "items.seller_id": sellerId
        }).populate('user_id', 'name email').sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Fetch Seller Orders Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get all active/verified sellers (Admin/Support only)
 */
exports.getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller', sellerStatus: 'ACTIVE' }).sort({ createdAt: -1 });
    res.status(200).json(sellers);
  } catch (error) {
    console.error("Get Sellers Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get seller profile by email
 */
exports.getCurrentSeller = async (req, res) => {
    try {
        const { email } = req.params;
        const seller = await User.findOne({ email, role: 'seller' });
        if (!seller) {
            return res.status(404).json({ error: "Seller not found" });
        }
        res.status(200).json(seller);
    } catch (error) {
        console.error("Get Current Seller Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = exports;
