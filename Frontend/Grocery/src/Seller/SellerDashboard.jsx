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
import { Sparkles, TrendingUp, Bell, Calendar, ChevronRight, Package } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const SellerDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const { darkMode } = useTheme();
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
    salesTrend: []
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
            const sellerRes = await api.get(`/api/seller/current-seller/${user.email}`);
            setSeller(sellerRes.data);

            const summaryRes = await api.get(`/api/seller/dashboard-summary?sellerId=${sellerRes.data._id}`);
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

  const salesTrend = dashboardData.salesTrend && dashboardData.salesTrend.length > 0 
    ? dashboardData.salesTrend 
    : [
        { name: 'Mon', sales: 0 },
        { name: 'Tue', sales: 0 },
        { name: 'Wed', sales: 0 },
        { name: 'Thu', sales: 0 },
        { name: 'Fri', sales: 0 },
        { name: 'Sat', sales: 0 },
        { name: 'Sun', sales: 0 },
      ];

  const sellerStats = [
    { id: 1, label: 'Total Earnings', value: `₹${dashboardData.earnings.toLocaleString()}`, trend: 12, type: 'currency' },
    { id: 2, label: 'Recent Orders', value: dashboardData.orders.toString(), trend: 5, type: 'number' },
    { id: 3, label: 'Live Products', value: dashboardData.totalProducts.toString(), trend: 0, type: 'number' },
    { id: 4, label: 'Orders to Process', value: dashboardData.pendingOrders.toString(), trend: -2, type: 'number' },
  ];

  return (
    <div className={cn("min-h-screen flex transition-colors duration-300", darkMode ? "bg-surface-dark text-slate-100" : "bg-slate-50 text-slate-900")}>
      {/* Sidebar */}
      <SellerSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-500 min-h-screen",
        isCollapsed ? "ml-20" : "ml-64"
      )}>
        <SellerTopbar />

        <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-10">
            {isDashboardHome ? (
                <div className="space-y-10 animate-fade-in-up">
                    {/* Header Context */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                              Good morning, {user.name.split(' ')[0]}! <span className="inline-block animate-bounce-slow">✨</span>
                            </h1>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                               <Calendar size={16} />
                               <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white dark:bg-surface-dark-gray rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                              <Bell size={18} className="text-slate-400" />
                              <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700" />
                              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Store Live</span>
                              <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse shadow-glow shadow-brand-500/50" />
                           </div>
                        </div>
                    </div>

                    {/* KPI Stats Upgrade */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {sellerStats.map((stat, idx) => (
                            <KPICard key={stat.id} {...stat} index={idx} />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Revenue Performance Chart */}
                        <div className="lg:col-span-8 premium-card p-6 md:p-8 bg-white dark:bg-surface-dark-gray border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-10">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold">Revenue Insight</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Your store sales performance this week</p>
                                </div>
                                <div className="p-3 bg-brand-50 dark:bg-brand-900/20 text-brand-600 rounded-2xl">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                                    <AreaChart data={salesTrend}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#1e293b" : "#f1f5f9"} />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: darkMode ? '#64748b' : '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: darkMode ? '#64748b' : '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: darkMode ? '#1e1e1e' : '#fff', 
                                                border: 'none', 
                                                borderRadius: '20px', 
                                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                                                color: darkMode ? '#fff' : '#000'
                                            }}
                                            itemStyle={{ fontWeight: 'bold', color: '#22c55e' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="sales" 
                                            stroke="#22c55e" 
                                            strokeWidth={4}
                                            fillOpacity={1} 
                                            fill="url(#colorSales)" 
                                            animationDuration={1500}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Seller Insights Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                           <div className="premium-card p-8 bg-gradient-to-br from-brand-600 to-emerald-700 text-white border-none shadow-xl shadow-brand-500/20 overflow-hidden relative">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -rotate-45 translate-x-12 -translate-y-12 rounded-full" />
                              
                              <div className="flex items-center gap-3 mb-8 relative z-10">
                                  <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
                                      <Sparkles className="w-5 h-5" />
                                  </div>
                                  <h3 className="text-xl font-bold">Deep Insights</h3>
                              </div>

                              <div className="space-y-6 relative z-10">
                                  {[
                                    { title: "Trending Item", desc: "\"Fresh Avocados\" is surging! +20% demand this week.", icon: <TrendingUp size={16}/> },
                                    { title: "Stock Alert", desc: "5 products are below safety threshold of 10 items.", icon: <Package size={16}/> },
                                    { title: "New Feature", desc: "You can now export monthly tax invoices directly.", icon: <Sparkles size={16}/> }
                                  ].map((insight, i) => (
                                    <div key={i} className="group p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all">
                                        <div className="flex items-center gap-2 mb-1">
                                           {insight.icon}
                                           <h4 className="text-sm font-bold">{insight.title}</h4>
                                        </div>
                                        <p className="text-xs text-white/70 leading-relaxed font-medium">{insight.desc}</p>
                                    </div>
                                  ))}
                              </div>

                              <button className="w-full mt-8 py-4 bg-white text-brand-700 rounded-2xl font-bold text-sm shadow-xl shadow-black/10 hover:bg-brand-50 transition-all flex items-center justify-center gap-2 group">
                                  Generate Full Report <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                              </button>
                           </div>

                           <div className="premium-card p-8 bg-white dark:bg-surface-dark-gray border border-slate-200 dark:border-slate-800">
                              <h4 className="font-bold mb-4">Top Customers</h4>
                              <div className="space-y-4">
                                 {[1,2,3].map(i => (
                                   <div key={i} className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                                         <div className="text-sm font-bold">Customer #{i + 10}</div>
                                      </div>
                                      <div className="text-xs font-bold text-brand-600">₹{Math.floor(Math.random() * 5000)} spent</div>
                                   </div>
                                 ))}
                              </div>
                           </div>
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
