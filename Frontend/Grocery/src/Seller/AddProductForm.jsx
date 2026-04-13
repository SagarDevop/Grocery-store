import React, { useState, useEffect } from "react";
import api from "../api/apiConfig";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { 
  Package, 
  IndianRupee, 
  Layers, 
  Info, 
  Image as ImageIcon, 
  Box, 
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { cn } from "../Utils/cn";

const AddProductForm = () => {
  const user = useSelector((state) => state.auth.user);
  const { seller } = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();
  const editProduct = location.state?.editProduct;

  const [loadingSeller, setLoadingSeller] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    "Vegetables", "Fresh Fruits", "Personal Care", "Daily Essentials",
    "Instant Food", "Dairy Products", "Bakery & Breads", "Grains & Cereals",
  ];

  const units = [
    { value: "g", label: "Gram (g)" },
    { value: "kg", label: "Kilogram (kg)" },
    { value: "packet", label: "Packet" },
    { value: "box", label: "Box" },
    { value: "liter", label: "Liter (L)" },
    { value: "per item", label: "Per item" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    amount: "",
    unit: "",
    category: "",
    description: "",
    image1: "",
    image2: "",
  });

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name,
        price: editProduct.price,
        stock: editProduct.stock,
        amount: editProduct.amount,
        unit: editProduct.unit,
        category: editProduct.category,
        description: editProduct.description || "",
        image1: editProduct.images[0] || "",
        image2: editProduct.images[1] || "",
      });
    }
  }, [editProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!seller) return toast.error("Seller details not verified yet.");

    const payload = {
      seller_id: seller._id,
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      amount: parseFloat(formData.amount),
      unit: formData.unit,
      category: formData.category,
      description: formData.description,
      images: [formData.image1, formData.image2].filter(Boolean),
    };

    try {
      setSubmitting(true);
      if (editProduct) {
        await api.put(`/api/products/${editProduct._id}`, payload);
        toast.success("Product updated successfully!");
      } else {
        await api.post("/api/products", payload);
        toast.success("New product listed successfully!");
      }
      navigate("/seller-dashboard/sellerproductlist");
    } catch (err) {
      toast.error(editProduct ? "Failed to update product" : "Failed to list product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingSeller) return (
    <div className="p-20 text-center">
        <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm font-medium">Verifying Credentials...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate(-1)}
                className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {editProduct ? "Refine Listing" : "Marketplace Entry"}
                </h2>
                <p className="text-gray-500 mt-1">
                    {editProduct ? "Update details to stay competitive." : "Add a high-quality listing to the platform."}
                </p>
            </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        {/* Basic Info */}
        <div className="admin-card p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                    <Info className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900">General Information</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="e.g. Organic Alphonso Mango"
                        onChange={handleChange}
                        value={formData.name}
                        required
                        className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Category</label>
                    <select
                        name="category"
                        onChange={handleChange}
                        value={formData.category}
                        required
                        className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all appearance-none"
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Description</label>
                    <textarea
                        name="description"
                        placeholder="Tell customers why they should buy this..."
                        onChange={handleChange}
                        value={formData.description}
                        rows={4}
                        className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                    />
                </div>
            </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="admin-card p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                    <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900">Pricing & Inventory</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Price (₹)</label>
                    <input
                        type="number"
                        name="price"
                        placeholder="0.00"
                        onChange={handleChange}
                        value={formData.price}
                        required
                        className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-emerald-700 font-bold"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Stock Level</label>
                    <input
                        type="number"
                        name="stock"
                        placeholder="Quantity"
                        onChange={handleChange}
                        value={formData.stock}
                        required
                        className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Pack Weight/Qty</label>
                    <input
                        type="number"
                        name="amount"
                        placeholder="e.g. 500"
                        onChange={handleChange}
                        value={formData.amount}
                        required
                        className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Unit</label>
                    <select
                        name="unit"
                        onChange={handleChange}
                        value={formData.unit}
                        required
                        className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all appearance-none"
                    >
                        <option value="">Unit</option>
                        {units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                    </select>
                </div>
            </div>

            <div className="pt-4 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                        <ImageIcon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-gray-900">Visual Assets</h3>
                </div>
                <input
                    type="url"
                    name="image1"
                    placeholder="Primary Image URL"
                    onChange={handleChange}
                    value={formData.image1}
                    required
                    className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
                <input
                    type="url"
                    name="image2"
                    placeholder="Secondary Image URL (Optional)"
                    onChange={handleChange}
                    value={formData.image2}
                    className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                />
            </div>
        </div>

        <div className="lg:col-span-2 flex items-center justify-end gap-4 mt-4">
            <button 
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-3 bg-white border border-gray-200 text-gray-500 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all active:scale-95"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-10 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-xl shadow-emerald-200 disabled:opacity-50 active:scale-95"
            >
                {submitting ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                    <CheckCircle2 className="w-4 h-4" />
                )}
                {editProduct ? "Publish Changes" : "Confirm Listing"}
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
