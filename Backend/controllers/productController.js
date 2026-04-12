const Product = require('../models/Product');
const Seller = require('../models/Seller');
const mongoose = require('mongoose');

/**
 * List all products
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    
    // The Flask app converts ObjectIds to strings in the response
    // Mongoose handles this well, but we ensure the output format matches
    const formattedProducts = products.map(p => ({
      ...p._doc,
      _id: p._id.toString(),
      seller_id: p.seller_id.toString()
    }));

    res.status(200).json(formattedProducts);
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
      ...product._doc,
      _id: product._id.toString(),
      seller_id: product.seller_id._id.toString(),
      seller: seller ? {
        name: seller.name,
        phone: seller.phone,
        email: seller.email,
        store: seller.store,
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
      ...p._doc,
      _id: p._id.toString(),
      seller_id: p.seller_id.toString()
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
