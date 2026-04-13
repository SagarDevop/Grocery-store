const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');
const { emailQueue } = require('../services/queueService');

/**
 * Get User Order History
 */
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Fetch Orders Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get Seller Specific Orders
 */
exports.getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.query.sellerId;
        if (!sellerId) return res.status(400).json({ error: "Seller ID required" });

        // Find orders that contain items from this seller
        const orders = await Order.find({ "items.seller_id": sellerId }).sort({ createdAt: -1 });
        
        // Filter items in each order to only show those belonging to this seller
        const filteredOrders = orders.map(order => {
            const orderObj = order.toObject();
            orderObj.items = orderObj.items.filter(item => item.seller_id.toString() === sellerId);
            return orderObj;
        });

        res.status(200).json(filteredOrders);
    } catch (error) {
        console.error("Fetch Seller Orders Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Update Order Status
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, comment } = req.body;

        const order = await Order.findById(id).populate('user_id', 'email name');
        if (!order) return res.status(404).json({ error: "Order not found" });

        order.status = status;
        order.timeline.push({ status, comment });
        await order.save();

        // Trigger Notification in Background
        if (order.user_id && order.user_id.email) {
            emailQueue.add({
                type: 'STATUS_UPDATE',
                data: {
                    email: order.user_id.email,
                    orderId: order._id,
                    status: status
                }
            });
        }

        res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get Single Order Details
 */
exports.getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user_id: req.user._id });
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.status(200).json(order);
    } catch (error) {
        console.error("Fetch Order Details Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Place Order (Checkout)
 */
exports.checkout = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { shipping_address, payment_method, coupon_code } = req.body;
        
        const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }

        let subtotal = 0;
        const orderItems = [];
        
        for (const item of cart.items) {
            const product = item.productId;
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }
            
            subtotal += product.price * item.quantity;
            orderItems.push({
                product_id: product._id,
                seller_id: product.seller_id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                status: 'CONFIRMED'
            });
        }

        // 🎟️ Handle Coupon Discount
        let discount_amount = 0;
        let applied_coupon = null;
        if (coupon_code) {
            const Coupon = require('../models/Coupon');
            const coupon = await Coupon.findOne({ code: coupon_code.toUpperCase(), isActive: true });
            
            if (coupon && (new Date() < coupon.expiryDate) && (subtotal >= coupon.minOrderAmount)) {
                // Check uses
                if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
                    if (coupon.type === 'PERCENT') {
                        discount_amount = (subtotal * coupon.value) / 100;
                    } else {
                        discount_amount = coupon.value;
                    }
                    applied_coupon = coupon;
                }
            }
        }

        // 🚚 Calculate Delivery Fee (Growth Trigger: Free over ₹500)
        const delivery_fee = subtotal >= 500 ? 0 : 40;
        const totalAmount = subtotal - discount_amount + delivery_fee;

        const newOrder = new Order({
            user_id: req.user._id,
            items: orderItems,
            subtotal,
            discount_amount,
            coupon_code: applied_coupon ? applied_coupon.code : null,
            delivery_fee,
            total_amount: totalAmount,
            status: 'PLACED',
            payment_status: payment_method === 'COD' ? 'PENDING' : 'PAID',
            shipping_address,
            timeline: [{ status: 'PLACED', comment: 'Order placed via User Checkout' }]
        });

        await newOrder.save({ session });

        // Update Coupon count if used
        if (applied_coupon) {
            applied_coupon.usedCount += 1;
            applied_coupon.usersUsed.push(req.user._id);
            await applied_coupon.save({ session });
        }

        const sellerGroups = orderItems.reduce((acc, item) => {
            if (!acc[item.seller_id]) acc[item.seller_id] = 0;
            acc[item.seller_id] += (item.price * item.quantity);
            return acc;
        }, {});

        for (const [sellerId, grossAmount] of Object.entries(sellerGroups)) {
            const commissionAmount = grossAmount * 0.10;
            const netAmount = grossAmount - commissionAmount;

            await Transaction.create([{
                order_id: newOrder._id,
                seller_id: sellerId,
                type: 'SALE',
                gross_amount: grossAmount,
                commission_amount: commissionAmount,
                net_amount: netAmount,
                status: 'COMPLETED'
            }], { session });

            for (const item of orderItems.filter(i => i.seller_id.toString() === sellerId)) {
                await Product.findByIdAndUpdate(item.product_id, {
                    $inc: { stock: -item.quantity }
                }, { session });
            }
        }

        cart.items = [];
        await cart.save({ session });

        // 🛒 Cancel Abandoned Cart Recovery Job
        const { emailQueue } = require('../services/queueService');
        await emailQueue.removeJobs(`abandoned-${req.user._id}`);

        await session.commitTransaction();
        session.endSession();

        // 📧 Offload Email to Background Queue
        try {
            const user = await User.findById(req.user._id);
            if (user && user.email) {
                emailQueue.add({
                    type: 'ORDER_CONFIRMATION',
                    data: {
                        email: user.email,
                        order: newOrder
                    }
                });
            }
        } catch (emailErr) {
            console.error("Queue Addition Error:", emailErr);
        }

        res.status(201).json({ message: "Order placed successfully", order_id: newOrder._id });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Checkout Error:", error.message);
        res.status(400).json({ error: error.message || "Checkout failed" });
    }
};

/**
 * middleware to track recently viewed products
 */
exports.trackRecentlyViewed = async (req, res, next) => {
    if (!req.user || !req.params.id) return next();
    
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            const productId = req.params.id;
            user.recently_viewed = user.recently_viewed.filter(id => id.toString() !== productId);
            user.recently_viewed.unshift(productId);
            if (user.recently_viewed.length > 5) user.recently_viewed.pop();
            await user.save();
        }
    } catch (err) {
        console.error("Tracking error:", err);
    }
    next();
};
