import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./Admin/Sidebar";
import AdminTopbar from "./Admin/Topbar";
import Overview from "./Admin/Overview";
import PendingSellers from "../Seller/PendingSellers";
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
  // In a full implementation, we'd use nested <Routes> and <Outlet />
  // For now, we'll maintain parity by showing PendingSellers on the specific path
  const isOverview = location.pathname === "/admin-dashboard";
  const isSellers = location.pathname === "/admin-dashboard/sellers";

  return (
    <div className="admin-theme min-h-screen flex selection:bg-emerald-100">
      {/* Sidebar */}
      <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 transition-all duration-500 min-h-screen",
        isCollapsed ? "ml-20" : "ml-64"
      )}>
        <AdminTopbar />

        <div className="p-8 max-w-[1600px] mx-auto">
          {isOverview && <Overview />}
          {isSellers && (
            <div className="space-y-6">
                 <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Seller Management</h2>
                    <p className="text-gray-500 mt-2">Review and manage platform vendor requests.</p>
                </div>
                <div className="admin-card overflow-hidden">
                    <PendingSellers />
                </div>
            </div>
          )}
          
          {/* Fallback for other routes */}
          {!isOverview && !isSellers && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">🏗️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Under Construction</h3>
                <p className="text-gray-500 mt-2 max-w-sm">
                    This section of the GreenCart Admin is being prepared for deployment.
                </p>
                <button 
                  onClick={() => navigate("/admin-dashboard")}
                  className="mt-8 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-lg shadow-emerald-200"
                >
                  Back to Overview
                </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
