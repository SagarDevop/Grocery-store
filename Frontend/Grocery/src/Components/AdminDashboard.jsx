import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./Admin/Sidebar";
import AdminTopbar from "./Admin/Topbar";
import Overview from "./Admin/Overview";
import PendingSellers from "../Seller/PendingSellers";
import UserManagement from "./Admin/UserManagement";
import AdminOrderList from "./Admin/AdminOrderList";
import { cn } from "../Utils/cn";

export default function AdminDashboard() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Immediate redirect if not admin
    if (!user || (!user.is_admin && user.role !== 'admin')) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || (!user.is_admin && user.role !== 'admin')) {
    return null;
  }

  // Determine which sub-view to show
  const isOverview = location.pathname === "/admin-dashboard";
  const isSellers = location.pathname === "/admin-dashboard/sellers";
  const isUsers = location.pathname === "/admin-dashboard/users";
  const isOrders = location.pathname === "/admin-dashboard/orders";

  return (
    <div className="admin-theme min-h-screen flex selection:bg-emerald-100">
      {/* Sidebar */}
      <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 transition-all duration-500 min-h-screen overflow-x-hidden",
        isCollapsed ? "ml-20" : "ml-64"
      )}>
        <AdminTopbar />

        <div className="p-8 max-w-[1600px] mx-auto">
          {isOverview && <Overview />}
          {isSellers && (
            <div className="space-y-6">
                 <div className="mb-8">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Seller Management</h2>
                    <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest">Verification Registry</p>
                </div>
                <div className="admin-card overflow-hidden">
                    <PendingSellers />
                </div>
            </div>
          )}
          {isUsers && <UserManagement />}
          {isOrders && <AdminOrderList />}
          
          {/* Fallback for other routes */}
          {!isOverview && !isSellers && !isUsers && !isOrders && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">🏗️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Module Under Update</h3>
                <p className="text-gray-500 mt-2 max-w-sm">
                    This section is being synchronized with the master database. 
                </p>
                <button 
                  onClick={() => navigate("/admin-dashboard")}
                  className="mt-8 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-lg shadow-emerald-200 uppercase font-black text-xs tracking-widest"
                >
                  Return to Command Center
                </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
