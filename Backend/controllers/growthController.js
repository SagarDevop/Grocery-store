const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

/**
 * Get Personalized Recommendations
 * Returns Recently Viewed and Suggested Products based on user behavior.
 */
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: 'recently_viewed',
      select: 'name price images category stock'
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // 1. Get Recently Viewed
    const recentlyViewed = user.recently_viewed || [];

    // 2. Get Suggested (Simple logic: Products from categories user has viewed/bought)
    const viewedCategories = [...new Set(recentlyViewed.map(p => p.category))];
    
    let suggested = [];
    if (viewedCategories.length > 0) {
      suggested = await Product.find({
        category: { $in: viewedCategories },
        _id: { $nin: recentlyViewed.map(p => p._id) } // Exclude already viewed
      })
      .limit(8)
      .select('name price images category averageRating');
    }

    // Fallback if no specific suggestions: Get popular products
    if (suggested.length < 4) {
      const popular = await Product.find()
        .sort({ totalReviews: -1 })
        .limit(8);
      suggested = [...suggested, ...popular].slice(0, 8);
    }

    res.status(200).json({ recentlyViewed, suggested });
  } catch (error) {
    console.error("Recommendations Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get Quick Reorder Items
 * Fetches items from recent successful orders for one-click repurchase.
 */
exports.getQuickReorder = async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user._id, status: 'DELIVERED' })
      .sort({ createdAt: -1 })
      .limit(3);

    const reorderItems = [];
    const seenProductIds = new Set();

    orders.forEach(order => {
      order.items.forEach(item => {
        if (!seenProductIds.has(item.product_id.toString())) {
          reorderItems.push(item);
          seenProductIds.add(item.product_id.toString());
        }
      });
    });

    res.status(200).json(reorderItems.slice(0, 10));
  } catch (error) {
    console.error("Quick Reorder Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
