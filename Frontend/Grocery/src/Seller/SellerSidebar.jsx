import React from "react";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  PlusCircle,
  Settings, 
  LogOut,
  ChevronLeft,
  User,
  ShoppingBasket
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../Utils/cn";
import { useDispatch } from "react-redux";
import { logoutUser } from "../Redux/authSlice";
import { motion } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/seller-dashboard" },
  { icon: Package, label: "My Inventory", path: "/seller-dashboard/sellerproductlist" },
  { icon: PlusCircle, label: "Add Product", path: "/seller-dashboard/add-product" },
  { icon: ShoppingBag, label: "Manage Orders", path: "/seller-dashboard/orders" },
  { icon: TrendingUp, label: "Revenue", path: "/seller-dashboard/earnings" },
  { icon: User, label: "Store Profile", path: "/seller-dashboard/profile" },
];

export default function SellerSidebar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const dispatch = useDispatch();

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen transition-all duration-500 z-50 glass-effect border-r border-slate-200 dark:border-slate-800",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="flex flex-col h-full p-4 overflow-hidden">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/30">
            <ShoppingBasket className="text-white w-6 h-6" />
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col truncate"
            >
                <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                    Green<span className="text-brand-500">Hub</span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Vendor Network</span>
            </motion.div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 p-3.5 rounded-2xl transition-all group relative",
                  isActive 
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" 
                    : "text-slate-500 dark:text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/10"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-brand-500"
                )} />
                {!isCollapsed && <span className="font-bold text-sm">{item.label}</span>}
                {isActive && !isCollapsed && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="ml-auto w-1.5 h-6 rounded-full bg-white/40" 
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <button 
            onClick={() => {
                 if(window.confirm("Are you sure you want to sign out?")) {
                    dispatch(logoutUser());
                 }
            }}
            className="flex items-center gap-3 p-3.5 rounded-2xl w-full text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 w-full transition-all text-slate-400 group"
          >
            <ChevronLeft className={cn("w-5 h-5 transition-transform duration-500 group-hover:scale-110", isCollapsed && "rotate-180")} />
          </button>
        </div>
      </div>
    </aside>
  );
}
