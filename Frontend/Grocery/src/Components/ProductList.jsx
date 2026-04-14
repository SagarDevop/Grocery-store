import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FilterBar from "./FilterBar";
import SortBar from "./SortBar";
import ProductCard from "./ProductCard.jsx";
import { Allproduct } from "../api/auth.js";
import { ChevronLeft, ChevronRight, SlidersHorizontal, LayoutGrid, List, SearchX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";

const ProductList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "All";
  const sortBy = searchParams.get("sort") || "default";
  const page = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    setLoading(true);
    const params = {
      page,
      limit: 12,
      category: category !== "All" ? category : undefined,
      q: query,
      sort: sortBy
    };

    Allproduct(params)
      .then((res) => {
        setProducts(res.data.products);
        setPagination(res.data.pagination);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products", err);
        setLoading(false);
      });
  }, [page, category, sortBy, query]);

  const handlePageChange = (newPage) => {
    searchParams.set("page", newPage);
    navigate({ search: searchParams.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categories = ["All", "Vegetables", "Fruits", "Dairy", "Bakery", "Beverages", "Snacks"];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-dark pb-20">
      {/* Header Context */}
      <div className="bg-white dark:bg-surface-dark-gray border-b border-slate-200 dark:border-slate-800 py-10 px-[6vw]">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {query ? `Results for "${query}"` : category !== "All" ? category : "Explore Groceries"}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {pagination.total} high-quality products found
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" className="hidden lg:flex gap-2">
                <SlidersHorizontal size={18} /> Filters
              </Button>
              <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2 hidden lg:block" />
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button className="p-2 bg-white dark:bg-slate-700 shadow-sm rounded-lg text-brand-600">
                  <LayoutGrid size={20} />
                </button>
                <button className="p-2 text-slate-400 dark:text-slate-500">
                  <List size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="w-full lg:w-64 space-y-8 shrink-0">
            <div className="glass-effect p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800">
              <FilterBar
                categories={categories}
                selected={category}
                onSelect={(cat) => {
                  searchParams.set("category", cat);
                  searchParams.set("page", 1);
                  navigate({ search: searchParams.toString() });
                }}
              />
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                <SortBar 
                  sortBy={sortBy} 
                  onSortChange={(sort) => {
                    searchParams.set("sort", sort);
                    navigate({ search: searchParams.toString() });
                  }} 
                />
              </div>
            </div>
            
            {/* Promo Card */}
            <div className="hidden lg:block relative rounded-[2rem] overflow-hidden bg-brand-600 p-8 text-white group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-400/20 to-transparent" />
              <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">Weekend Sale</p>
              <h4 className="text-2xl font-black mb-4">20% Off Fruits</h4>
              <Button size="sm" variant="secondary" className="bg-white text-brand-700 w-full group-hover:scale-105 transition-transform">
                Claim Offer
              </Button>
            </div>
          </aside>

          {/* Main Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-[4/5] bg-white dark:bg-surface-dark-gray border border-slate-100 dark:border-slate-800 rounded-[2rem] animate-pulse" />
                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse px-4" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 glass-effect rounded-[3rem] text-center"
              >
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                  <SearchX size={40} className="text-slate-400" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">No items found</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
                  We couldn't find any products matching your current selection.
                </p>
                <Button onClick={() => navigate('/products')}>Clear Filters</Button>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((prod) => (
                    <ProductCard key={prod._id} product={prod} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-20">
                    <Button
                      disabled={page === 1}
                      onClick={() => handlePageChange(page - 1)}
                      variant="secondary"
                      size="icon"
                      className="rounded-xl border border-slate-200 dark:border-slate-800"
                    >
                      <ChevronLeft size={20} />
                    </Button>
                    
                    <div className="flex gap-2">
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={cn(
                            "w-11 h-11 rounded-xl text-sm font-bold transition-all duration-300",
                            page === i + 1 
                              ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30 ring-4 ring-brand-500/10" 
                              : "bg-white dark:bg-surface-dark-gray text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-brand-500"
                          )}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <Button
                      disabled={page === pagination.pages}
                      onClick={() => handlePageChange(page + 1)}
                      variant="secondary"
                      size="icon"
                      className="rounded-xl border border-slate-200 dark:border-slate-800"
                    >
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
