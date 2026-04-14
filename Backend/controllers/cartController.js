const Cart = require('../models/Cart');
const User = require('../models/User');

/**
 * Fetch a user's cart
 */
exports.getUserCart = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    let cart = await Cart.findOne({ userId: user._id }).populate('items.productId');
    if (!cart) {
      cart = await Cart.create({ userId: user._id, items: [] });
    }

    res.status(200).json({ cart: cart.items });
  } catch (error) {
    console.error("Fetch Cart Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update the current user's cart
 */
exports.updateUserCart = async (req, res) => {
  try {
    const { cart } = req.body; // Support 'cart' key from frontend
    const cartItems = cart || req.body.cartItems || [];
    
    // Validate data structure
    if (!Array.isArray(cartItems)) {
        return res.status(400).json({ error: "Cart items must be an array" });
    }

    // req.user from authMiddleware
    let userCart = await Cart.findOne({ userId: req.user._id });
    
    if (!userCart) {
      userCart = new Cart({ 
          userId: req.user._id, 
          items: cartItems.map(item => ({
              productId: item._id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image || (item.images && item.images[0])
          })) 
      });
    } else {
      userCart.items = cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || (item.images && item.images[0])
      }));
    }

    await userCart.save();

    // 🛒 Schedule Abandoned Cart Recovery (Delayed Job)
    // Wrap in try-catch to keep it non-blocking if Redis is down
    try {
        const { emailQueue } = require('../services/queueService');
        // Remove existing delay job if any to reset the clock
        await emailQueue.removeJobs(`abandoned-${req.user._id}`).catch(() => {});
        await emailQueue.add({
            type: 'ABANDONED_CART',
            data: { userId: req.user._id }
        }, { 
            jobId: `abandoned-${req.user._id}`,
            delay: 24 * 60 * 60 * 1000 // 24 Hours
        }).catch(() => {});
    } catch (queueError) {
        // Silently fail queue operations to prioritize user response
        // console.warn("Queue Operation Failed (Likely Redis):", queueError.message);
    }

    res.status(200).json({ message: "Cart synced successfully" });
  } catch (error) {
    console.error("Update Cart Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
