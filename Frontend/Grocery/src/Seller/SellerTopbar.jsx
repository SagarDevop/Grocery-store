import React from "react";
import { Search, Bell, User, MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";

export default function SellerTopbar() {
    const user = useSelector((state) => state.auth.user);

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4">
            <div className="flex items-center justify-between">
                {/* Search */}
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search products, orders, customers..." 
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 transition-colors relative">
                        <MessageSquare className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    
                    <div className="h-8 w-px bg-gray-100 mx-2"></div>

                    <div className="flex items-center gap-3 pl-2">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900 leading-none">{user?.name}</p>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Verified Seller</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold shadow-sm">
                            {user?.name?.[0] || <User className="w-5 h-5" />}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
