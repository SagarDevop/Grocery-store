import React from "react";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addToCart } from "../Redux/cartSlice";
import { toggleWishlist } from "../Redux/wishlistSlice";
import { Error, Success } from "../Utils/toastUtils";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { cn } from "../Utils/cn";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const wishlist = useSelector((state) => state.wishlist.items);

  const productId =
    typeof product._id === "object" && product._id.$oid
      ? product._id.$oid
      : product._id || product.id;

  const isInWishlist = wishlist?.some(item => 
    (typeof item === 'string' ? item : item._id) === productId
  );

  const showProduct = () => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      Error("Please login to add items to cart");
      navigate("/auth", { state: { from: location } });
      return;
    }
    dispatch(addToCart(product));
    Success(`${product.name} added to cart!`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!user) {
      Error("Please login to manage wishlist");
      return;
    }
    dispatch(toggleWishlist(productId));
    Success(isInWishlist ? "Removed from Wishlist" : "Added to Wishlist");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col premium-card overflow-hidden bg-white dark:bg-surface-dark-gray"
      onClick={showProduct}
    >
      {/* Badge Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.discount > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
            {product.discount}% OFF
          </span>
        )}
        {product.totalSales > 50 && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
             Best
          </span>
        )}
      </div>

      {/* Action Buttons Overlay */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:translate-x-4 md:group-hover:translate-x-0">
        <button 
          onClick={handleWishlist}
          className={cn(
            "p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 border",
            isInWishlist 
              ? "bg-red-500 border-red-500 text-white" 
              : "bg-white/90 dark:bg-slate-800/90 border-slate-100 dark:border-slate-700 text-slate-400"
          )}
        >
          <Heart size={18} className={isInWishlist ? "fill-current" : ""} />
        </button>
      </div>

      {/* Image Container */}
      <div className="aspect-[4/5] relative overflow-hidden bg-slate-50 dark:bg-slate-900/50">
        <img
          src={
            product.images && product.images.length > 0
              ? product.images[0]
              : product.image || "/placeholder.png"
          }
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-1">
          {product.category}
        </div>
        <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-2">
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 dark:text-white">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="text-xs text-slate-400 line-through">₹{product.mrp}</span>
            )}
          </div>
          
          <Button
            onClick={handleAddToCart}
            variant="primary"
            size="icon"
            className="rounded-xl w-10 h-10 shadow-md md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300"
          >
            <ShoppingCart size={18} />
          </Button>
        </div>

        {/* Stock Status */}
        {product.stock > 0 && product.stock < 10 && (
          <div className="mt-3 flex items-center gap-1.5">
            <div className="h-1 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-orange-500" style={{ width: '30%' }} />
            </div>
            <span className="text-[10px] font-bold text-orange-600 whitespace-nowrap">Only {product.stock} left</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
