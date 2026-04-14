const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * List all products
 * Query Params: page, limit, category, sort
 */
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.category) query.category = req.query.category;

    // Use projections to only select needed fields for list view
    const products = await Product.find(query)
      .select('name price images category stock amount unit averageRating totalReviews')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Product.countDocuments(query);

    res.status(200).json({
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get product by ID with seller info
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find product and populate seller info
    // In Flask, it was a separate query: seller = sellers_collection.find_one({"_id": seller_id})
    const product = await Product.findById(id).populate('seller_id');
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const seller = product.seller_id;
    const formattedProduct = {
      _id: product._id.toString(),
      name: product.name,
      price: product.price,
      images: product.images,
      category: product.category,
      stock: product.stock,
      amount: product.amount,
      unit: product.unit,
      description: product.description,
      averageRating: product.averageRating,
      totalReviews: product.totalReviews,
      seller: seller ? {
        name: seller.name,
        store: seller.storeName,
        city: seller.storeCity,
        rating: seller.sellerRating
      } : null
    };

    res.status(200).json(formattedProduct);
  } catch (error) {
    console.error("Get Product ID Error:", error);
    res.status(400).json({ error: "Invalid product ID" });
  }
};

/**
 * Filter products by category
 */
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category_name } = req.params;
    const products = await Product.find({ category: category_name });
    
    const formattedProducts = products.map(p => ({
      _id: p._id.toString(),
      name: p.name,
      price: p.price,
      images: p.images,
      category: p.category,
      stock: p.stock,
      amount: p.amount,
      unit: p.unit,
      averageRating: p.averageRating,
      totalReviews: p.totalReviews
    }));

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Category Fetch Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get unique categories
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Add a new product
 * Requires 'seller' role
 */
exports.addProduct = async (req, res) => {
  const { seller_id, name, price, stock, amount, unit, category, images, description } = req.body;

  const requiredFields = ['seller_id', 'name', 'price', 'stock', 'amount', 'unit', 'category', 'images'];
  if (!requiredFields.every(field => req.body[field] !== undefined)) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Validate seller_id format (Flask caught this in a try-except block)
    if (!mongoose.Types.ObjectId.isValid(seller_id)) {
      return res.status(400).json({ error: "Invalid seller_id format" });
    }

    const newProduct = await Product.create({
      seller_id,
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      amount: parseFloat(amount),
      unit,
      category,
      images,
      description,
      created_at: new Date()
    });

    res.status(201).json({
      message: "Product added",
      product_id: newProduct._id.toString()
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get Popular Products (Best Sellers)
 * Uses total quantity sold in successful orders as a metric.
 */
exports.getPopularProducts = async (req, res) => {
  try {
    const Order = require('../models/Order');
    
    // Aggregate orders to find top products
    const popularData = await Order.aggregate([
      { $match: { status: { $ne: 'CANCELLED' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product_id',
          totalSold: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 8 }
    ]);

    const productIds = popularData.map(item => item._id);
    const products = await Product.find({ _id: { $in: productIds } })
      .select('name price images category stock amount unit averageRating totalReviews');

    res.status(200).json(products);
  } catch (error) {
    console.error("Get Popular Products Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update a product
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json({ message: "Product updated", product });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete a product
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = exports;
