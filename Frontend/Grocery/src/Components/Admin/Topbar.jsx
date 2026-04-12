import React from "react";
import { Search, Bell, Mail, Plus } from "lucide-react";
import { useSelector } from "react-redux";

export default function AdminTopbar() {
    const user = useSelector(state => state.auth.user);

    return (
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 px-8 flex items-center justify-between">
            {/* Search */}
            <div className="relative w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search anything... (⌘K)"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all text-sm text-gray-900"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
                <button className="hidden lg:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-200 hover:scale-105">
                    <Plus className="w-4 h-4" />
                    Quick Action
                </button>

                <div className="flex items-center gap-2 pr-6 border-r border-gray-100">
                    <button className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-emerald-600 transition-all relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-emerald-600 transition-all">
                        <Mail className="w-5 h-5" />
                    </button>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900">{user?.name || "Admin"}</p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Master Admin</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 border-2 border-white flex items-center justify-center font-bold text-white shadow-md shadow-emerald-100">
                        {user?.name?.[0]?.toUpperCase() || "A"}
                    </div>
                </div>
            </div>
        </header>
    );
}
