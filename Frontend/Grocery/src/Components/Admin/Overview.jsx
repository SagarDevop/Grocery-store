import React, { useEffect, useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import KPICard from "./KPICard";
import AIInsights from "./AIInsights";
import { fetchAdminStats, fetchAdminActivity } from "../../api/auth";
import { motion } from "framer-motion";
import { Clock, ArrowRight, UserPlus, Package } from "lucide-react";
import { cn } from "../../Utils/cn";

export default function Overview() {
    const [stats, setStats] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    const [systemHealth, setSystemHealth] = useState(null);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [statsRes, activityRes] = await Promise.all([
                    fetchAdminStats(),
                    fetchAdminActivity()
                ]);
                setStats(statsRes.data.stats);
                setSalesData(statsRes.data.salesData);
                setSystemHealth(statsRes.data.systemHealth);
                setActivity(activityRes.data);
            } catch (err) {
                console.error("Dashboard Load Error:", err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* System Status Banner */}
            <div className="flex items-center justify-between bg-emerald-50/50 border border-emerald-100 rounded-2xl px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full blur-sm opacity-50"></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Platform Status: {systemHealth?.status || 'Active'}</span>
                </div>
                <div className="flex gap-8 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-2 tracking-wider">UPTIME: <b className="text-emerald-600">{systemHealth?.uptime}</b></span>
                    <span className="flex items-center gap-2 tracking-wider">LATENCY: <b className="text-emerald-600">{systemHealth?.latency}</b></span>
                </div>
            </div>

            {/* Platform KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((item, index) => (
                    <KPICard key={item.id} {...item} index={index} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Platform Growth Chart */}
                <div className="lg:col-span-2 admin-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Platform Performance</h3>
                            <p className="text-gray-500 text-sm">GMV vs Platform Commission</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                <span className="text-xs text-gray-500">GMV</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                <span className="text-xs text-gray-500">Commission</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorGMV" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorComm" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#94A3B8" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                />
                                <YAxis 
                                    stroke="#94A3B8" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(value) => `₹${value}`}
                                />
                                <Tooltip 
                                    contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#111827', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="gmv" 
                                    stroke="#10B981" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorGMV)" 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="commission" 
                                    stroke="#3B82F6" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorComm)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI Insights Panel */}
                <div className="lg:col-span-1">
                    <AIInsights />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="admin-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-900">System Events</h3>
                        <Clock className="w-5 h-5 text-gray-400" />
                    </div>

                    <div className="space-y-6">
                        {activity.map((item, idx) => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (idx * 0.1) }}
                                className="flex gap-4 group"
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                                    item.type === 'USER_SIGNUP' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                                )}>
                                    {item.type === 'USER_SIGNUP' ? <UserPlus className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium text-gray-900 truncate">{item.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <button className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="w-4 h-4 text-gray-400 hover:text-emerald-600" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Platform Summary Section */}
                <div className="admin-card p-8 bg-emerald-50/30 border-emerald-100 flex flex-col justify-center text-center">
                    <h4 className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-xs mb-4">Platform Health Summary</h4>
                    <p className="text-gray-700 text-lg font-medium max-w-sm mx-auto">
                        Your marketplace is currently performing <span className="text-emerald-600">12% above</span> last week's average.
                    </p>
                    <div className="mt-8 flex justify-center gap-12">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">99.9%</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Sync Rate</p>
                        </div>
                        <div className="w-[1px] h-10 bg-gray-200" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">45ms</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Latency</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
