import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../Utils/cn";
import { motion } from "framer-motion";

export default function KPICard({ label, value, trend, type, index }) {
  const isPositive = trend >= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="admin-card p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold",
          isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(trend)}%
        </div>
      </div>
      
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
          {value}
        </h3>
        {type === 'currency' && <span className="text-xs text-gray-400 font-medium">INR</span>}
      </div>

      <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.abs(trend) * 5, 100)}%` }}
            className={cn("h-full", isPositive ? "bg-emerald-500" : "bg-red-500")}
        />
      </div>
    </motion.div>
  );
}
