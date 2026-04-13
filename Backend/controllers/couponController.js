const Coupon = require('../models/Coupon');

/**
 * Validate Coupon
 * POST /api/coupons/validate
 */
exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const userId = req.user ? req.user._id : null;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ error: "Invalid coupon code" });
    }

    // Check expiry
    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({ error: "Coupon has expired" });
    }

    // Check min order amount
    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({ error: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}` });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ error: "Coupon usage limit reached" });
    }

    // Check per-user limit (one time per user)
    if (userId && coupon.usersUsed.includes(userId)) {
      return res.status(400).json({ error: "You have already used this coupon" });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === 'PERCENT') {
      discountAmount = (orderAmount * coupon.value) / 100;
    } else {
      discountAmount = coupon.value;
    }

    // Ensure discount doesn't exceed order amount
    discountAmount = Math.min(discountAmount, orderAmount);

    res.status(200).json({
      message: "Coupon applied successfully",
      discountAmount,
      couponCode: coupon.code,
      type: coupon.type,
      value: coupon.value
    });
  } catch (error) {
    console.error("Validate Coupon Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Create Coupon (Admin Only)
 */
exports.createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json(coupon);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Get All Active Coupons
 */
exports.getActiveCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({ isActive: true, expiryDate: { $gt: new Date() } });
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}
