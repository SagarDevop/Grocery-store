const User = require('../models/User');

/**
 * Fetch a user's cart by email
 * In Flask: @app.route("/api/cart/<email>", methods=["GET"])
 */
exports.getUserCart = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ cart: user.cart || [] });
  } catch (error) {
    console.error("Fetch Cart Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update the current user's cart in the database
 * Requires login. Matches @app.route("/api/cart/update", methods=["POST"])
 */
exports.updateUserCart = async (req, res) => {
  try {
    const { cart } = req.body;

    // req.user has been populated by the 'protect' middleware
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    user.cart = cart;
    await user.save();

    res.status(200).json({ message: "Cart updated" });
  } catch (error) {
    console.error("Update Cart Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
