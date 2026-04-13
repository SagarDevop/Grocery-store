const Review = require('../models/Review');
const Product = require('../models/Product');
const Seller = require('../models/Seller');
const Order = require('../models/Order');
const mongoose = require('mongoose');

/**
 * 1. Add a Review
 * Eligibility: User must have bought the product and the order status must be 'DELIVERED'.
 */
exports.addReview = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { product_id, order_id, rating, comment } = req.body;
        const user_id = req.user._id;

        // 1. Check if order exists and belongs to user
        const order = await Order.findOne({ _id: order_id, user_id: user_id });
        if (!order) {
            return res.status(403).json({ error: "Order not found or access denied" });
        }

        // 2. Check if product is in that order and order is delivered
        const productExists = order.items.some(item => item.product_id.toString() === product_id);
        if (!productExists) {
            return res.status(400).json({ error: "Product was not part of this order" });
        }

        if (order.status !== 'DELIVERED') {
            return res.status(400).json({ error: "You can only review products after they are delivered" });
        }

        // 3. Check for existing review (One review per product per order)
        const existingReview = await Review.findOne({ user_id, product_id, order_id });
        if (existingReview) {
            return res.status(400).json({ error: "You have already reviewed this product for this order" });
        }

        // 4. Create Review
        const review = new Review({
            user_id,
            product_id,
            order_id,
            rating,
            comment
        });
        await review.save({ session });

        // 5. Update Product Rating Stats
        const product = await Product.findById(product_id);
        if (product) {
            const oldTotal = product.totalReviews || 0;
            const newTotal = oldTotal + 1;
            const currentAvg = product.averageRating || 0;
            
            // Re-calculate average
            product.averageRating = ((currentAvg * oldTotal) + rating) / newTotal;
            product.totalReviews = newTotal;
            await product.save({ session });

            // 6. Update Seller Rating (Aggregation of all their product ratings or simple avg)
            const seller = await Seller.findById(product.seller_id);
            if (seller) {
                const oldSellerAvg = seller.sellerRating || 0;
                const totalSellerSales = seller.totalSales || 0; 
                // Using totalSales as a weight for simplicity, or we could aggregate all reviews
                seller.sellerRating = ((oldSellerAvg * oldTotal) + rating) / newTotal; // Simplified logic
                await seller.save({ session });
            }
        }

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ success: true, message: "Review posted successfully", review });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Add Review Error:", error);
        res.status(500).json({ error: "Failed to post review" });
    }
};

/**
 * 2. Get Product Reviews
 */
exports.getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ product_id: productId })
            .populate('user_id', 'name profile_image')
            .sort({ createdAt: -1 });

        // Calculate breakdown
        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(r => { breakdown[r.rating]++; });

        res.status(200).json({ reviews, breakdown });
    } catch (error) {
        console.error("Fetch Reviews Error:", error);
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
};

/**
 * 3. Delete Review
 */
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id);
        
        if (!review) return res.status(404).json({ error: "Review not found" });
        
        // Ownership check
        if (review.user_id.toString() !== req.user._id.toString() && !req.user.is_admin) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await Review.findByIdAndDelete(id);
        res.status(200).json({ message: "Review deleted" });
    } catch (error) {
        console.error("Delete Review Error:", error);
        res.status(500).json({ error: "Failed to delete review" });
    }
};
