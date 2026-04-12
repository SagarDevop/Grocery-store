import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api/apiConfig";
import SellerSidebar from "./SellerSidebar";
import SellerTopbar from "./SellerTopbar";
import KPICard from "../Components/Admin/KPICard";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { cn } from "../Utils/cn";
import { Sparkles, ShoppingBag, Package, TrendingUp } from "lucide-react";

const SellerDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [seller, setSeller] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    orders: 0,
    earnings: 0,
    pendingOrders: 0,
    notifications: [],
  });

  const isDashboardHome = location.pathname === "/seller-dashboard";

  useEffect(() => {
    if (!user || user.role !== "seller") {
      navigate("/");
      return;
    }

    const initDashboard = async () => {
        try {
            setLoading(true);
            // 1. Fetch the real seller ID from Sellers collection
            const sellerRes = await api.get(`/api/current-seller/${user.email}`);
            setSeller(sellerRes.data);

            // 2. Fetch summary using the REAL seller ID
            const summaryRes = await api.get(`/api/seller-dashboard-summary?sellerId=${sellerRes.data._id}`);
            setDashboardData(summaryRes.data);
        } catch (err) {
            console.error("Error initializing dashboard", err);
        } finally {
            setLoading(false);
        }
    };
    initDashboard();
  }, [user, navigate]);

  if (!user || user.role !== "seller") return null;

  // Mock sales data for the chart (industrial standard usually has this)
  const salesTrend = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  const sellerStats = [
    { id: 1, label: 'Store Earnings', value: `₹${dashboardData.earnings.toLocaleString()}`, trend: 12, type: 'currency' },
    { id: 2, label: 'Order Volume', value: dashboardData.orders.toString(), trend: 5, type: 'number' },
    { id: 3, label: 'Active Listings', value: dashboardData.totalProducts.toString(), trend: 0, type: 'number' },
    { id: 4, label: 'Pending Orders', value: dashboardData.pendingOrders.toString(), trend: -2, type: 'number' },
  ];

  return (
    <div className="admin-theme min-h-screen flex selection:bg-emerald-100">
      {/* Sidebar */}
      <SellerSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-500 min-h-screen",
        isCollapsed ? "ml-20" : "ml-64"
      )}>
        <SellerTopbar />

        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
            {isDashboardHome ? (
                <div className="space-y-8 animate-in fade-in duration-700">
                    {/* Welcome Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
                            <p className="text-gray-500 mt-1">Here's what's happening with your store today.</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100 uppercase tracking-widest">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            Store Operational
                        </div>
                    </div>

                    {/* KPI Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {sellerStats.map((stat, idx) => (
                            <KPICard key={stat.id} {...stat} index={idx} />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Revenue Chart */}
                        <div className="lg:col-span-2 admin-card p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Revenue Performance</h3>
                                    <p className="text-sm text-gray-500">Weekly sales trend for your store</p>
                                </div>
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={salesTrend}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#fff', 
                                                border: 'none', 
                                                borderRadius: '12px', 
                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                                            }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="sales" 
                                            stroke="#10b981" 
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill="url(#colorSales)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Activity/Insights */}
                        <div className="admin-card p-8 bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-none shadow-emerald-200">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold">Seller Insights</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                                    <h4 className="text-sm font-bold mb-1">Top Selling Category</h4>
                                    <p className="text-xs text-white/70">"Fresh Fruits" is currently your highest performing category with 45 sales this week.</p>
                                </div>
                                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                                    <h4 className="text-sm font-bold mb-1">Inventory Alert</h4>
                                    <p className="text-xs text-white/70">3 products are reaching low stock levels. We recommend restocking soon.</p>
                                </div>
                                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                                    <h4 className="text-sm font-bold mb-1">Platform Tip</h4>
                                    <p className="text-xs text-white/70">Adding multiple images to your products can increase sales conversion by up to 25%.</p>
                                </div>
                            </div>

                            <button className="w-full mt-8 py-3 bg-white text-emerald-700 rounded-xl font-bold text-sm shadow-xl hover:bg-emerald-50 transition-colors">
                                View Full Report
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Outlet context={{ seller }} />
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;
