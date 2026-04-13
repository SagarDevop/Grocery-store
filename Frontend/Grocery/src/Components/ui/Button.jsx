import React from 'react';
import { cn } from '../../Utils/cn';

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20',
    secondary: 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700',
    outline: 'border-2 border-brand-500 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20',
    ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg font-bold',
    icon: 'p-2.5',
  };

  return (
    <button
      ref={ref}
      disabled={loading || props.disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
