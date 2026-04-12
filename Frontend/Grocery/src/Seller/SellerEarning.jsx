import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  DollarSign,
  Calendar,
  Download,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from '../Utils/cn';

const data = [
  { month: 'Jan', amount: 4500 },
  { month: 'Feb', amount: 5200 },
  { month: 'Mar', amount: 4800 },
  { month: 'Apr', amount: 6100 },
  { month: 'May', amount: 5900 },
  { month: 'Jun', amount: 7200 },
];

export default function SellerEarning() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Financial Insights</h2>
            <p className="text-gray-500 mt-1">Track your revenue and payout performance.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-100 text-gray-900 rounded-xl font-bold text-sm transition-all shadow-sm hover:bg-gray-50 active:scale-95">
          <Download className="w-4 h-4 text-emerald-600" />
          Export Statement
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* Earnings Chart */}
            <div className="admin-card p-8 bg-white">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Revenue Growth</h3>
                        <p className="text-xs text-gray-400 font-medium">Monthly payout distribution</p>
                    </div>
                    <div className="flex items-center gap-2">
                         <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">
                            <TrendingUp className="w-3 h-3" />
                            +24% vs LY
                         </div>
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="month" 
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
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    border: 'none', 
                                    borderRadius: '12px', 
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                                }}
                            />
                            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#059669' : '#10b98120'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Payout History */}
            <div className="admin-card p-8 bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Payouts</h3>
                <div className="space-y-4">
                    {[
                        { date: 'June 12, 2026', amount: '₹12,450', status: 'Completed', ref: 'PAY-88291' },
                        { date: 'May 28, 2026', amount: '₹8,900', status: 'Completed', ref: 'PAY-77102' },
                        { date: 'May 14, 2026', amount: '₹6,200', status: 'Completed', ref: 'PAY-66491' },
                    ].map((payout, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-emerald-100 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-emerald-600">
                                    <Wallet className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{payout.amount}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{payout.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-100 uppercase tracking-widest">
                                    {payout.status}
                                </div>
                                <p className="text-[10px] text-gray-300 font-medium mt-1 uppercase mt-1 text-xs">{payout.ref}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Financial Cards */}
        <div className="space-y-6">
            <div className="admin-card p-6 bg-emerald-600 text-white border-none shadow-xl shadow-emerald-100">
                <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Available for Payout</p>
                <h3 className="text-3xl font-black tracking-tight mb-4">₹4,250.00</h3>
                <div className="h-px bg-white/20 mb-4" />
                <button className="w-full py-3 bg-white text-emerald-600 rounded-xl font-bold text-sm shadow-lg hover:bg-emerald-50 transition-colors">
                    Withdraw Funds
                </button>
            </div>

            <div className="admin-card p-6 bg-white space-y-4">
                <div className="flex items-center justify-between">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                        <Clock className="w-4 h-4" />
                    </div>
                </div>
                <div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Pending Clearance</p>
                    <h4 className="text-xl font-bold text-gray-900">₹1,120.00</h4>
                </div>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                    Estimated clearance date: **June 18, 2026**. This includes most recent customer payments.
                </p>
            </div>

            <div className="admin-card p-6 bg-white border-dashed border-2 border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                        <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">Banking Details</h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            <span>HDFC BANK</span>
                            <span>•</span>
                            <span>**** 4492</span>
                        </div>
                    </div>
                </div>
                <button className="w-full mt-4 py-2 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-50 transition-colors">
                    Manage Accounts
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
