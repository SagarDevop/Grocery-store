import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Store, 
  Settings, 
  LogOut,
  ChevronLeft,
  Search,
  Box
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../Utils/cn";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin-dashboard" },
  { icon: Store, label: "Sellers", path: "/admin-dashboard/sellers" },
  { icon: Box, label: "Products", path: "/admin-dashboard/products" },
  { icon: ShoppingBag, label: "Orders", path: "/admin-dashboard/orders" },
  { icon: Users, label: "Users", path: "/admin-dashboard/users" },
  { icon: Settings, label: "Settings", path: "/admin-dashboard/settings" },
];

export default function AdminSidebar({ isCollapsed, setIsCollapsed }) {
  const location = useLocation();

  return (
    <aside className={cn(
      "admin-glass fixed left-0 top-0 h-screen transition-all duration-500 z-50",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="flex flex-col h-full p-4 overflow-hidden">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
                <span className="font-bold text-lg tracking-tight text-gray-900 leading-none">
                    Admin<span className="text-emerald-600">Node</span>
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">System Console</span>
            </div>
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
                  "flex items-center gap-3 p-3 rounded-xl transition-all group",
                  isActive 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                    : "text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/50"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-500"
                )} />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-600" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <button className="flex items-center gap-3 p-3 rounded-xl w-full text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">Sign Out</span>}
          </button>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 w-full transition-colors text-gray-400"
          >
            <ChevronLeft className={cn("w-5 h-5 transition-transform", isCollapsed && "rotate-180")} />
          </button>
        </div>
      </div>
    </aside>
  );
}
