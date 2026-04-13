import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/cartSlice";
import api from "../api/apiConfig";
import { RefreshCcw, Plus, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const QuickReorder = () => {
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuickReorder = async () => {
      try {
        const res = await api.get("/api/growth/quick-reorder");
        setItems(res.data);
      } catch (err) {
        console.error("Quick Reorder fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuickReorder();
  }, []);

  if (loading || items.length === 0) return null;

  const handleQuickAdd = (item) => {
    // Map order item structure back to product structure if needed
    const product = {
        _id: item.product_id,
        name: item.name,
        price: item.price,
        image: item.images?.[0] || `https://source.unsplash.com/featured/?grocery,${item.name}`,
    };
    dispatch(addToCart(product));
    toast.success(`${item.name} added again!`);
  };

  return (
    <section className="mt-12 p-8 bg-slate-50 rounded-[40px] border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
          <RefreshCcw size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Buy It Again</h2>
          <p className="text-xs text-slate-500 font-medium tracking-tight">Essentials from your previous orders</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex-shrink-0 w-40 bg-white p-4 rounded-3xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-3">
               <img 
                  src={item.image || `https://source.unsplash.com/featured/?grocery,${item.name}`} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
               />
            </div>
            <h4 className="text-[10px] font-black text-slate-800 uppercase truncate mb-1">{item.name}</h4>
            <p className="text-xs font-black text-emerald-600 mb-3">₹{item.price}</p>
            <button 
                onClick={() => handleQuickAdd(item)}
                className="w-full py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1"
            >
                <Plus size={12} /> Add
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default QuickReorder;
