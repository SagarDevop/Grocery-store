import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Success, Error } from "../Utils/toastUtils.js";

const AddProductForm = () => {
  const user = useSelector((state) => state.auth.user);
  const categories = [
    "Vegetables",
    "Fresh Fruits",
    "Cold Drinks",
    "Instant Food",
    "Dairy Products",
    "Bakery & Breads",
    "Grains & Cereals",
  ];
  console.log("User from AuthContext:", user);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    quantity: "",
    unit: "",
    category: "",
    description: "",
    image1: "",
    image2: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      seller_id: user._id,
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      description: formData.description,
      images: [formData.image1, formData.image2].filter(Boolean), // only non-empty URLs
    };

    try {
      const res = await axios.post(
        "https://grocery-store-ue2n.onrender.com/add-product",
        payload
      );
      Success("Product added successfully!"); // or just alert("...")
      setFormData({
        name: "",
        price: "",
        stock: "",
        quantity: "",
        unit: "",
        category: "",
        description: "",
        image1: "",
        image2: "",
      });
    } catch (err) {
      Error("Failed to add product");
      console.error(err);
      console.log("Submitting payload:", payload);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          value={formData.name}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          onChange={handleChange}
          value={formData.price}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          onChange={handleChange}
          value={formData.stock}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <select
          name="unit"
          placeholder="Unit"
          value={formData.unit}
          onChange={handleChange}
          required
          className="border ml-2 p-2 rounded text-gray-400"
        >
          <option value="g">Gram (g)</option>
          <option value="kg">Kilogram (kg)</option>
          <option value="packet">Packet</option>
          <option value="box">Box</option>
          <option value="liter">Liter (L)</option>
          <option value="per item">Per item</option>
        </select>

        <input
          type="text"
          name="category"
          list="category-list"
          placeholder="Category"
          onChange={handleChange}
          value={formData.category}
          required
          className="w-full border p-2 rounded"
        />

        <datalist id="category-list">
          {categories.map((cat) => (
            <option key={cat} value={cat} />
          ))}
        </datalist>
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          value={formData.description}
          className="w-full border p-2 rounded"
          rows={3}
        ></textarea>
        <input
          type="url"
          name="image1"
          placeholder="Image URL 1"
          onChange={handleChange}
          value={formData.image1}
          className="w-full border p-2 rounded"
        />
        <input
          type="url"
          name="image2"
          placeholder="Image URL 2 (optional)"
          onChange={handleChange}
          value={formData.image2}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
