const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const mongoose = require('mongoose');

// Initialize Razorpay
// Note: These must be in your .env file
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * 1. Create Razorpay Order
 */
exports.createPaymentOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', shipping_address, items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "Cannot create order with empty items" });
        }

        // Create the Razorpay Order
        const options = {
            amount: Math.round(amount * 100), // Razorpay expects paise
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Save a PENDING order in our database to track it
        const newOrder = new Order({
            user_id: req.user._id,
            items: items.map(item => ({
                product_id: item._id,
                seller_id: item.seller_id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                status: 'PENDING'
            })),
            total_amount: amount,
            status: 'PLACED',
            payment_status: 'PENDING',
            shipping_address,
            razorpay_order_id: razorpayOrder.id,
            timeline: [{ status: 'PLACED', comment: 'Payment initiated via Razorpay' }]
        });

        await newOrder.save();

        res.status(200).json({
            success: true,
            key: process.env.RAZORPAY_KEY_ID,
            order: razorpayOrder,
            internal_order_id: newOrder._id
        });

    } catch (error) {
        console.error("Razorpay Order Creation Error:", error);
        res.status(500).json({ error: "Failed to initiate payment. Please check your configuration." });
    }
};

/**
 * 2. Verify Razorpay Payment Signature
 */
exports.verifyPayment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            internal_order_id 
        } = req.body;

        // Verify HMAC Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isSignatureValid = expectedSignature === razorpay_signature;

        if (!isSignatureValid) {
            throw new Error("Invalid payment signature. Potential fraud detected.");
        }

        // Update Order Status
        const order = await Order.findById(internal_order_id);
        if (!order) throw new Error("Order not found in registry");

        order.payment_status = 'PAID';
        order.razorpay_payment_id = razorpay_payment_id;
        order.razorpay_signature = razorpay_signature;
        order.timeline.push({ status: 'PAID', comment: `Payment verified via Razorpay ID: ${razorpay_payment_id}` });
        
        // Update item statuses
        order.items.forEach(item => { item.status = 'CONFIRMED'; });
        await order.save({ session });

        // 3. Handle Seller Commission Splitting (10%)
        const sellerGroups = order.items.reduce((acc, item) => {
            if (!acc[item.seller_id]) acc[item.seller_id] = 0;
            acc[item.seller_id] += (item.price * item.quantity);
            return acc;
        }, {});

        for (const [sellerId, grossAmount] of Object.entries(sellerGroups)) {
            const commissionAmount = grossAmount * 0.10;
            const netAmount = grossAmount - commissionAmount;

            await Transaction.create([{
                order_id: order._id,
                seller_id: sellerId,
                type: 'SALE',
                gross_amount: grossAmount,
                commission_amount: commissionAmount,
                net_amount: netAmount,
                status: 'COMPLETED',
                metadata: { razorpay_payment_id }
            }], { session });

            // Reduce product stock
            const sellerItems = order.items.filter(i => i.seller_id.toString() === sellerId);
            for (const item of sellerItems) {
                await Product.findByIdAndUpdate(item.product_id, {
                    $inc: { stock: -item.quantity }
                }, { session });
            }
        }

        // 4. Clear User Cart
        await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] }, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ 
            success: true, 
            message: "Payment verified and order confirmed", 
            order_id: order._id 
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Razorpay Verification Error:", error.message);
        res.status(400).json({ error: error.message || "Payment verification failed" });
    }
};
