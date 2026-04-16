import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import api from "../api/apiConfig";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../Redux/cartSlice";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import { 
  Star, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Users, 
  Award,
  ChevronRight,
  MessageSquare,
  Truck,
  RotateCcw,
  CheckCircle2,
  Share2,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import { cn } from "../Utils/cn";
import { Error, Success } from "../Utils/toastUtils";


export default function ProductDetail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [viewers] = useState(Math.floor(Math.random() * 20) + 12);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [prodRes, reviewRes] = await Promise.all([
          api.get(`/api/products/${id}`),
          api.get(`/api/reviews/product/${id}`)
        ]);
        setProduct(prodRes.data);
        setReviews(reviewRes.data.reviews);
      } catch (err) {
        console.error("❌ Error fetching product details:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      Error("Please login to add items to cart");
      navigate('/auth', { state: { from: window.location.pathname } });
      return;
    }
    dispatch(addToCart(product));
  };

  const handleBuyNow = () => {
    if (!user) {
      Error("Please login to proceed to checkout");
      navigate('/auth', { state: { from: window.location.pathname } });
      return;
    }
    dispatch(addToCart(product));
    navigate('/cart');
  };

  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-surface-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Loading Freshness...</p>
        </div>
      </div>
    );

  const avgRating = product.averageRating || 0;
  const images = product.images?.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-dark py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
           <span className="hover:text-brand-500 cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
           <ChevronRight size={14} />
           <span className="hover:text-brand-500 cursor-pointer transition-colors" onClick={() => navigate('/products')}>Products</span>
           <ChevronRight size={14} />
           <span className="text-slate-900 dark:text-slate-200 font-bold truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Left: Media Gallery (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-[2rem] bg-white dark:bg-surface-dark-gray border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl"
            >
              <Swiper
                modules={[Navigation, Pagination, EffectFade]}
                effect="fade"
                navigation
                pagination={{ clickable: true, dynamicBullets: true }}
                onSlideChange={(swiper) => setActiveImg(swiper.activeIndex)}
                className="w-full h-full"
              >
                {images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={img}
                      alt={product.name}
                      className="w-full h-full object-cover p-6 mix-blend-multiply dark:mix-blend-normal"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              
              <div className="absolute top-6 right-6 z-10 space-y-3">
                 <Button variant="ghost" size="icon" className="bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-2xl shadow-premium">
                    <Heart size={20} className="text-slate-400 hover:text-red-500 transition-colors" />
                 </Button>
                 <Button variant="ghost" size="icon" className="bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-2xl shadow-premium">
                    <Share2 size={20} className="text-slate-400 hover:text-brand-500 transition-colors" />
                 </Button>
              </div>
            </motion.div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
               {images.map((img, i) => (
                 <button 
                  key={i}
                  className={cn(
                    "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-white dark:bg-surface-dark-gray",
                    activeImg === i ? "border-brand-500 shadow-lg shadow-brand-500/20" : "border-transparent opacity-60 hover:opacity-100 hover:border-slate-200"
                  )}
                 >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover p-2 mix-blend-multiply" />
                 </button>
               ))}
            </div>
          </div>

          {/* Right: Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <span className="px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400 text-xs font-black uppercase tracking-widest">
                    {product.category}
                 </span>
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full">
                    <Users size={14} className="animate-pulse" />
                    <span className="text-[10px] font-black">{viewers} people looking</span>
                 </div>
               </div>
               
               <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                 {product.name}
               </h1>
               
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-amber-500 text-white px-3 py-1 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20">
                    <Star size={16} fill="currentColor" />
                    {avgRating.toFixed(1)}
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 font-bold hover:underline cursor-pointer">
                    {reviews.length} Customer Reviews
                  </span>
               </div>
            </div>

            {/* Price section */}
            <div className="p-6 rounded-[2rem] bg-white dark:bg-surface-dark-gray border border-slate-200 dark:border-slate-800 shadow-premium">
               <div className="flex items-end gap-3 mb-6">
                  <span className="text-3xl font-black text-brand-600 dark:text-brand-400">₹{product.price}</span>
                  {product.mrp > product.price && (
                    <span className="text-lg text-slate-400 line-through font-bold mb-1">₹{product.mrp || product.price + 20}</span>
                  )}
                  {product.discount && (
                    <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-lg mb-1 shadow-lg shadow-red-500/20">
                      {product.discount}% OFF
                    </span>
                  )}
               </div>

               <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pack Size</p>
                    <p className="text-base font-bold text-slate-800 dark:text-slate-200">{product.amount || '500'} {product.unit || 'g'}</p>
                 </div>
                 <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Status</p>
                    <p className={cn(
                      "text-base font-bold",
                      product.stock > 10 ? "text-emerald-500" : product.stock > 0 ? "text-orange-500" : "text-red-500"
                    )}>
                      {product.stock > 10 ? 'Available' : product.stock > 0 ? `Only ${product.stock} Left` : 'Out of Stock'}
                    </p>
                 </div>
               </div>

               {/* Urgent CTA */}
               {product.stock > 0 && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="flex-1 h-14 rounded-2xl group" onClick={handleAddToCart}>
                    Add To Cart
                  </Button>
                  <Button size="lg" variant="secondary" className="flex-1 h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black border-none" onClick={handleBuyNow}>
                    Buy Now <Zap size={16} fill="currentColor" className="ml-2" />
                  </Button>
                </div>
               )}
            </div>

            {/* Trust Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="flex items-start gap-3 p-4 rounded-3xl bg-white dark:bg-surface-dark-gray border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="p-2 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-xl">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Express Delivery</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Arrives within 30-45 minutes</p>
                  </div>
               </div>
               <div className="flex items-start gap-3 p-4 rounded-3xl bg-white dark:bg-surface-dark-gray border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl">
                    <RotateCcw size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Quality Check</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">100% replacement guarantee</p>
                  </div>
               </div>
            </div>

            {/* High Trust Section */}
            <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50">
               <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                    <CheckCircle2 size={18} />
                  </div>
                  <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-sm">GreenCart Verified Freshness</h4>
               </div>
               <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {['Strict Quality Control', 'Pesticide Free', 'No Preservatives', 'Farm to Table'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-[10px] font-bold text-emerald-700 dark:text-emerald-500/80">
                      <ChevronRight size={12} /> {item}
                    </li>
                  ))}
               </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section Upgrade */}
        <section className="mt-12 pt-10 border-t border-slate-200 dark:border-slate-800">
           <div className="flex flex-col lg:flex-row gap-20">
              <div className="lg:w-1/3 space-y-8">
                 <div className="space-y-2">
                    <span className="text-brand-600 dark:text-brand-400 font-bold uppercase tracking-widest text-xs">Community Feedback</span>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white">What Users Say</h2>
                 </div>
                 
                 <div className="p-12 rounded-[3.5rem] bg-white dark:bg-surface-dark-gray border border-slate-200 dark:border-slate-800 text-center shadow-xl shadow-slate-100/50 dark:shadow-none">
                    <p className="text-7xl font-black text-slate-900 dark:text-white mb-2">{avgRating.toFixed(1)}</p>
                    <div className="flex justify-center gap-1 text-amber-500 mb-6">
                       {[1,2,3,4,5].map(s => <Star key={s} size={24} fill={s <= Math.round(avgRating) ? "currentColor" : "none"} />)}
                    </div>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em] mb-8">Out of 5 Stars</p>
                    <div className="space-y-3">
                       {[5,4,3,2,1].map(r => (
                          <div key={r} className="flex items-center gap-3">
                             <span className="text-xs font-bold w-4">{r}</span>
                             <div className="h-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${r === 5 ? 85 : r === 4 ? 60 : 15}%` }}
                                  className="h-full bg-brand-500" 
                                />
                             </div>
                             <span className="text-xs text-slate-400 font-bold w-12">{r === 5 ? '85%' : r === 4 ? '12%' : '1%'}</span>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="lg:w-2/3 space-y-8">
                 {reviews.length > 0 ? (
                    reviews.map((review, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        key={idx} 
                        className="p-8 rounded-[2.5rem] bg-white dark:bg-surface-dark-gray border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative"
                      >
                         <div className="absolute top-8 right-8 text-slate-200 dark:text-slate-700">
                            <Star size={48} fill="currentColor" stroke="none" className="opacity-10" />
                         </div>
                         <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                               <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-emerald-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg">
                                  {review.user_id?.name?.charAt(0) || 'G'}
                               </div>
                               <div>
                                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg uppercase tracking-tight">{review.user_id?.name}</h4>
                                  <div className="flex gap-0.5 text-amber-500 mt-1">
                                     {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= review.rating ? "currentColor" : "none"} />)}
                                  </div>
                               </div>
                            </div>
                            <span className="text-xs text-slate-400 font-bold">{new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                         </div>
                         <p className="text-slate-600 dark:text-slate-400 font-medium leading-[1.8] italic text-lg">
                           "{review.comment}"
                         </p>
                      </motion.div>
                    ))
                 ) : (
                    <div className="py-32 text-center glass-effect rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                       <MessageSquare size={48} className="text-slate-200 mx-auto mb-4" />
                       <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No reviews yet</h3>
                       <p className="text-slate-500">Be the first to share your experience with this product!</p>
                       <Button variant="outline" className="mt-8">Join the Discussion</Button>
                    </div>
                 )}
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
