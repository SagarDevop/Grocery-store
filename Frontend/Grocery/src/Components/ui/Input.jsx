import React from 'react';
import { cn } from '../../Utils/cn';

const Input = React.forwardRef(({ className, type, label, error, ...props }, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm ring-offset-white transition-all duration-300 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-surface-dark-gray dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-brand-500",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 ml-1">{error}</span>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
