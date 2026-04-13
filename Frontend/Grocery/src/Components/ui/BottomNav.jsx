import React from "react";
import { NavLink } from "react-router-dom";
import { Home, LayoutGrid, ShoppingBag, User, Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { cn } from "../../Utils/cn";

const BottomNav = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { icon: Home, label: "Home", path: "/" },
    { icon: LayoutGrid, label: "Categories", path: "/products" },
    { icon: ShoppingBag, label: "Cart", path: "/cart", count: cartCount },
    { icon: Heart, label: "Wishlist", path: "/wishlist" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden">
      {/* Visual background with blur */}
      <div className="absolute inset-0 bg-white/80 dark:bg-black/40 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800" />
      
      <div className="relative flex justify-around items-center h-20 px-4">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => 
              cn(
                "relative flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all duration-300",
                isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-400 dark:text-slate-500"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <link.icon size={22} className={cn("transition-transform duration-300", isActive && "scale-110")} />
                  {link.count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce-slow">
                      {link.count}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold tracking-tight">{link.label}</span>
                
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-dot"
                    className="absolute -bottom-2 w-1 h-1 bg-brand-500 rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
      
      {/* IOS Safe Area padding */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white/80 dark:bg-black/40 backdrop-blur-xl" />
    </nav>
  );
};

export default BottomNav;
