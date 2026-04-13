import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiConfig";
import ProductCard from "./ProductCard";
import CategorySkeleton from "./CategorySkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Filter, LayoutGrid, List, SearchX, ArrowLeft } from "lucide-react";
import { Button } from "./ui/Button";

const CategoryPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(name);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchByCategory = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/products/category/${decodedName}`);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error("❌ Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchByCategory();
  }, [decodedName]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-dark pb-20">
      {/* Dynamic Category Header */}
      <div className="relative h-64 md:h-80 bg-brand-600 overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-brand-600/90 to-transparent z-10" />
        <img 
          src={`https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop`} 
          alt={decodedName}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-brand-100/80 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                >
                  <ArrowLeft size={16} /> Back to Shopping
                </button>
                <div className="flex items-center gap-4 text-brand-100 mb-2">
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Department</span>
                    <ChevronRight size={14} />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">{decodedName}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight capitalize">
                   {decodedName}
                </h1>
                <p className="text-brand-100 max-w-xl text-lg font-medium">
                  Discover our premium selection of {decodedName.toLowerCase()} sourced directly from the finest vendors.
                </p>
            </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Results Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
               <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Available Products
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    Showing {filteredProducts.length} premium items
                  </p>
               </div>
               
               <div className="flex items-center gap-3">
                  <Button variant="secondary" size="sm" className="hidden md:flex gap-2 rounded-xl">
                    <Filter size={16} /> Filter
                  </Button>
                  <div className="flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl">
                    <button className="p-2 bg-white dark:bg-slate-700 shadow-sm rounded-lg text-brand-600">
                      <LayoutGrid size={18} />
                    </button>
                    <button className="p-2 text-slate-400 dark:text-slate-500">
                      <List size={18} />
                    </button>
                  </div>
               </div>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CategorySkeleton />
                </motion.div>
              ) : filteredProducts.length > 0 ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                  {filteredProducts.map((prod) => (
                    <ProductCard key={prod._id} product={prod} />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-32 glass-effect rounded-[3rem] text-center"
                >
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8">
                    <SearchX size={48} className="text-slate-300" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">No products found</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-xs">
                    We couldn't find any items in the "{decodedName}" category at the moment.
                  </p>
                  <Button onClick={() => navigate('/products')}>Browse All Products</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
