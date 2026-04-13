import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiConfig";
import { motion } from "framer-motion";
import { Eye, TrendingUp, Sparkles, ShoppingBag } from "lucide-react";

const PersonalizedFeed = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ recentlyViewed: [], suggested: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get("/api/growth/recommendations");
        setData(res.data);
      } catch (err) {
        console.error("Personalization error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (loading || (data.recentlyViewed.length === 0 && data.suggested.length === 0)) {
    return null; // Don't show if no data
  }

  const ProductStrip = ({ title, products, icon: Icon, colorClass }) => (
    <section className="mb-16">
      <div className="flex items-center gap-2 mb-8">
        <div className={`p-2 rounded-xl ${colorClass}`}>
          <Icon size={20} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h2>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
        {products.map((product, idx) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => navigate(`/product/${product._id}`)}
            className="flex-shrink-0 w-64 bg-white rounded-[32px] border border-slate-100 p-4 cursor-pointer hover:shadow-xl transition-all group snap-start"
          >
            <div className="relative h-48 bg-slate-50 rounded-[24px] overflow-hidden mb-4">
              <img
                src={product.images?.[0] || product.image || `https://source.unsplash.com/featured/?grocery,${product.name}`}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <h4 className="font-bold text-slate-900 truncate uppercase text-sm mb-1">{product.name}</h4>
            <p className="text-xs text-slate-400 font-bold mb-4 capitalize">{product.category}</p>
            <div className="flex items-center justify-between">
              <p className="font-black text-emerald-600">₹{product.price}</p>
              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ShoppingBag size={14} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="px-[6vw] py-10">
      {data.recentlyViewed.length > 0 && (
        <ProductStrip 
          title="Pick Up Where You Left Off" 
          products={data.recentlyViewed} 
          icon={Eye} 
          colorClass="bg-blue-50 text-blue-600"
        />
      )}
      
      {data.suggested.length > 0 && (
        <ProductStrip 
          title="Recommended For You" 
          products={data.suggested} 
          icon={Sparkles} 
          colorClass="bg-purple-50 text-purple-600"
        />
      )}
    </div>
  );
};

export default PersonalizedFeed;
