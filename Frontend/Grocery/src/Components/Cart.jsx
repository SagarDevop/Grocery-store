import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, ShieldCheck, CreditCard } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Error } from "../Utils/toastUtils";
import { removeFromCart, increaseQty, decreaseQty } from "../Redux/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import { cn } from "../Utils/cn";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% tax
  const shipping = subtotal > 500 ? 0 : 40;
  const total = subtotal + tax + shipping;

  const FREE_DELIVERY_THRESHOLD = 500;
  const deliveryProgress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const remainingForFree = FREE_DELIVERY_THRESHOLD - subtotal;

  const handleIncreaseQty = (_id) => dispatch(increaseQty(_id));
  const handleDecreaseQty = (_id) => dispatch(decreaseQty(_id));
  const handleRemoveFromCart = (_id) => dispatch(removeFromCart(_id));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-surface-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Shopping Cart</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">You have {cart.length} items in your basket</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/products')} className="text-brand-600 font-bold group">
            Continue Shopping <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 glass-effect rounded-[3rem] text-center"
          >
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8">
              <ShoppingBag size={48} className="text-slate-300" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
            <Button size="lg" onClick={() => navigate('/products')}>Start Shopping</Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-6">
              {/* Delivery Goal Progress */}
              <div className="p-6 rounded-[2rem] bg-white dark:bg-surface-dark-gray border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Truck size={20} className="text-brand-500" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {remainingForFree > 0 
                        ? `Add ₹${remainingForFree} for FREE delivery` 
                        : "You've unlocked FREE delivery!"}
                    </span>
                  </div>
                  <span className="text-xs font-black text-brand-600 uppercase tracking-widest">
                    {Math.round(deliveryProgress)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${deliveryProgress}%` }}
                    className="h-full bg-brand-500"
                  />
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 rounded-[2rem] bg-white dark:bg-surface-dark-gray border border-slate-200 dark:border-slate-800 shadow-sm group"
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-32 h-32 rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-900/50 shrink-0">
                        <img
                          src={item.images?.[0] || item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0 py-2">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">{item.name}</h3>
                          <button
                            onClick={() => handleRemoveFromCart(item._id)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">{item.category}</p>
                        
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                            <button
                              onClick={() => handleDecreaseQty(item._id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-10 text-center font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                            <button
                              onClick={() => handleIncreaseQty(item._id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <div className="text-right">
                             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Subtotal</p>
                             <p className="text-xl font-black text-slate-900 dark:text-white font-display">₹{item.price * item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-6">
                <div className="p-8 rounded-[2.5rem] bg-white dark:bg-surface-dark-gray border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Order Summary</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                      <span className="text-slate-900 dark:text-white font-bold font-display">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-500 dark:text-slate-400">Estimated Tax (5%)</span>
                      <span className="text-slate-900 dark:text-white font-bold font-display">₹{tax.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-500 dark:text-slate-400">Shipping</span>
                      <span className={cn("font-bold font-display", shipping === 0 ? "text-brand-500" : "text-slate-900 dark:text-white")}>
                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mb-10">
                    <div className="flex justify-between items-end">
                       <span className="text-lg font-bold text-slate-900 dark:text-white">Total Amount</span>
                       <span className="text-4xl font-black text-brand-600 dark:text-brand-400 font-display">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full h-16 rounded-2xl text-lg group"
                    onClick={() => {
                      if (!user) {
                        Error("Please login to proceed to checkout");
                        navigate("/auth");
                        return;
                      }
                      navigate("/checkout");
                    }}
                  >
                    Checkout <CreditCard size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  
                  <div className="mt-8 flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <ShieldCheck size={18} className="text-brand-500" /> Secure SSL Encrypted Checkout
                    </div>
                  </div>
                </div>

                {/* Promo Code Card */}
                <div className="p-6 rounded-[2rem] bg-slate-900 dark:bg-slate-800 text-white overflow-hidden relative">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -rotate-45 translate-x-8 -translate-y-8 rounded-full" />
                   <h4 className="font-bold mb-4 relative z-10">Have a promo code?</h4>
                   <div className="flex gap-2 relative z-10">
                      <input 
                        type="text" 
                        placeholder="Code" 
                        className="flex-1 bg-white/10 border-white/20 rounded-xl px-4 py-2 text-sm focus:ring-brand-500 border focus:bg-white/20 transition-all outline-none"
                      />
                      <button className="bg-brand-500 px-4 py-2 rounded-xl text-sm font-bold hover:bg-brand-600 transition-colors">Apply</button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
