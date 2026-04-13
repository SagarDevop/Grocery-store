import React from "react";
import { Search, Bell, User, MessageSquare, Sun, Moon } from "lucide-react";
import { useSelector } from "react-redux";
import { useTheme } from "../context/ThemeContext";
import { Button } from "../Components/ui/Button";

export default function SellerTopbar() {
    const user = useSelector((state) => state.auth.user);
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <header className="sticky top-0 z-40 glass-effect border-b border-slate-200 dark:border-slate-800 px-8 py-4">
            <div className="flex items-center justify-between">
                {/* Search */}
                <div className="relative w-full max-w-md hidden md:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search products, orders, customers..." 
                        className="w-full pl-12 pr-4 h-11 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm font-medium focus:ring-2 ring-brand-500/50 transition-all outline-none"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 ml-auto">
                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleDarkMode}
                        className="text-slate-500 dark:text-slate-400"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </Button>

                    <Button variant="ghost" size="icon" className="relative text-slate-400">
                        <MessageSquare size={20} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-500 rounded-full border-2 border-white dark:border-surface-dark-gray shadow-glow shadow-brand-500/50"></span>
                    </Button>
                    
                    <Button variant="ghost" size="icon" className="relative text-slate-400">
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark-gray shadow-glow shadow-red-500/50"></span>
                    </Button>
                    
                    <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>

                    <div className="flex items-center gap-3 pl-2">
                        <div className="text-right hidden xl:block">
                            <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{user?.name}</p>
                            <p className="text-[10px] text-brand-500 font-black uppercase tracking-widest mt-1">Verified Partner</p>
                        </div>
                        <div className="w-11 h-11 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-black shadow-lg shadow-brand-500/30 ring-2 ring-brand-500/10">
                            {user?.name?.[0] || 'S'}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
