const Wishlist = require('../models/Wishlist');

/**
 * Get Wishlist
 */
exports.getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ userId: req.user._id }).populate('products');
        if (!wishlist) {
            wishlist = await Wishlist.create({ userId: req.user._id, products: [] });
        }
        res.status(200).json(wishlist);
    } catch (error) {
        console.error("Fetch Wishlist Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Toggle Product in Wishlist
 */
exports.toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        let wishlist = await Wishlist.findOne({ userId: req.user._id });
        
        if (!wishlist) {
            wishlist = new Wishlist({ userId: req.user._id, products: [productId] });
        } else {
            const index = wishlist.products.indexOf(productId);
            if (index > -1) {
                wishlist.products.splice(index, 1);
            } else {
                wishlist.products.push(productId);
            }
        }

        await wishlist.save();
        await wishlist.populate('products'); // Ensure UI gets populated objects immediately
        res.status(200).json({ message: "Wishlist updated", wishlist });
    } catch (error) {
        console.error("Toggle Wishlist Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
