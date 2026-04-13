import React from "react";
import { motion } from "framer-motion";

const CategorySkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
        <div 
          key={n} 
          className="bg-white dark:bg-surface-dark-gray rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-4 space-y-4 overflow-hidden"
        >
          {/* Image Placeholder */}
          <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
          
          {/* Content Placeholder */}
          <div className="space-y-3 px-2">
            <div className="h-2 w-1/3 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
            <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
            <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
            
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
              <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategorySkeleton;
