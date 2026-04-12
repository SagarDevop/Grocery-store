import React from 'react';
import { Sparkles, TrendingDown, AlertTriangle, Zap } from 'lucide-react';

export default function AIInsights() {
  const insights = [
      {
        id: 1,
        type: 'warning',
        title: 'Inventory Risk',
        message: 'Dairy products in Mumbai region seeing 40% surge. Stock might deplete in 48h.',
        icon: AlertTriangle,
        color: 'text-amber-600',
        bg: 'bg-amber-50'
      },
      {
        id: 2,
        type: 'opportunity',
        title: 'Top Category Growth',
        message: 'Organic Vegetables GMV dropped 5%. Suggesting a platform-wide 10% discount to revive.',
        icon: TrendingDown,
        color: 'text-red-600',
        bg: 'bg-red-50'
      },
      {
          id: 3,
          type: 'success',
          title: 'New Seller Dominance',
          message: 'FreshFruits Store has achieved 98% fulfillment rate since approval. Profile ready for Featured tag.',
          icon: Zap,
          color: 'text-blue-600',
          bg: 'bg-blue-50'
      }
    ];

    return (
      <div className="admin-card p-8 h-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
              <h3 className="text-xl font-bold text-gray-900">AI Intelligence</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">Automated Insights & Optimization</p>
          </div>
        </div>

        <div className="space-y-4">
          {insights.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-all group">
              <div className="flex gap-4">
                <div className={`w-8 h-8 rounded-lg ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.message}</p>
                  <button className="mt-3 text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors">
                      Take Action &rsaquo;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <p className="text-[10px] text-emerald-700 font-bold leading-relaxed">
              💡 TIP: Implementing a flash sale on "Dairy" could increase platform commission by 12% this weekend based on user search patterns.
            </p>
        </div>
    </div>
  );
}
