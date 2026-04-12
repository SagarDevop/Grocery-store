const PendingSeller = require('../models/PendingSeller');
const Seller = require('../models/Seller');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
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
    const newPending = await PendingSeller.create({
      name, phone, email, city, store, products
    });

    res.status(201).json({ 
      message: "Registration successful. Admin will review soon.",
      registration_id: newPending._id.toString()
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
    const pending = await PendingSeller.find();
    res.status(200).json(pending);
  } catch (error) {
    console.error("Get Pending Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Approve a seller (Admin only)
 * Moves from PendingSeller to Seller and updates User role
 */
exports.approveSeller = async (req, res) => {
  const { seller_id } = req.params;

  try {
    const pending = await PendingSeller.findById(seller_id);
    if (!pending) {
      return res.status(404).json({ error: "Request not found" });
    }

    const user = await User.findOne({ email: pending.email });
    if (!user) {
        return res.status(404).json({ error: "User account not found for this email" });
    }

    const newSeller = await Seller.create({
      name: pending.name,
      email: pending.email,
      phone: pending.phone,
      city: pending.city,
      store: pending.store,
      products: pending.products,
      password: user.password,
      role: 'seller'
    });

    user.role = 'seller';
    await user.save();

    await PendingSeller.findByIdAndDelete(seller_id);
    await sendSellerEmail(pending.email, "approved", pending.name);

    res.status(200).json({ message: "Seller approved", seller_id: newSeller._id.toString() });
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
    const pending = await PendingSeller.findById(seller_id);
    if (!pending) {
      return res.status(404).json({ error: "Request not found" });
    }

    await sendSellerEmail(pending.email, "rejected", pending.name);
    await PendingSeller.findByIdAndDelete(seller_id);

    res.status(200).json({ message: "Seller rejected" });
  } catch (error) {
    console.error("Reject Seller Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get current seller details by email
 */
exports.getCurrentSeller = async (req, res) => {
  try {
    const { email } = req.params;
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    res.status(200).json(seller);
  } catch (error) {
    console.error("Fetch Current Seller Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get user/seller profile
 */
exports.getProfile = async (req, res) => {
    try {
      const { email } = req.params;
      const user = await User.findOne({ email }).select('-password');
      const seller = await Seller.findOne({ email }).select('-password');
  
      const target = user || seller;
      if (!target) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.status(200).json(target);
    } catch (error) {
      console.error("Fetch Profile Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Seller Dashboard Summary
 */
exports.getSellerSummary = async (req, res) => {
  const { sellerId } = req.query;

  try {
    const totalProducts = await Product.countDocuments({ seller_id: sellerId });
    res.status(200).json({
      totalProducts,
      orders: 24, // Mock for now
      earnings: 45000, // Mock for now
      pendingOrders: 5, // Mock for now
      notifications: ["New order received", "Product approved", "Payout credited"]
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
        const { sellerId } = req.params;
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
        const { sellerId } = req.params;
        
        const orders = await Order.find({
            "items.seller_id": sellerId
        }).populate('user_id', 'name email').sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Fetch Seller Orders Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = exports;
