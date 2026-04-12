import React from 'react';
import { useSelector } from 'react-redux';
import { 
  User, 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck,
  Edit2,
  Camera,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../Utils/cn';

export default function SellerProfile() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Store Profile</h2>
            <p className="text-gray-500 mt-1">Manage your identity and business presence.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95">
          <Edit2 className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* Main Info */}
            <div className="admin-card p-10 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-10"></div>
                
                <div className="relative flex flex-col items-center sm:flex-row sm:items-end gap-6 mb-10 pt-4">
                    <div className="w-32 h-32 rounded-3xl bg-white border-4 border-white shadow-xl flex items-center justify-center text-emerald-600 font-black text-4xl overflow-hidden group">
                        {user?.name?.[0] || 'S'}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <Camera className="text-white w-8 h-8" />
                        </div>
                    </div>
                    <div className="flex-1 pb-2 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                             <h3 className="text-2xl font-black text-gray-900 tracking-tight">{user?.name}</h3>
                             <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        </div>
                        <p className="text-gray-500 font-medium">{user?.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Email Address</p>
                                <p className="text-sm font-bold text-gray-900">{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Contact Phone</p>
                                <p className="text-sm font-bold text-gray-900">+91 91234 56789</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Business Location</p>
                                <p className="text-sm font-bold text-gray-900">Mumbai, Maharashtra</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Verified Status</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-sm font-bold text-emerald-600 tracking-tight">Platinum Vendor</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Settings Snapshot */}
            <div className="admin-card p-8 bg-white border-dashed">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    Security & Access
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div>
                            <p className="text-sm font-bold text-gray-900">Two-Factor Authentication</p>
                            <p className="text-xs text-gray-400 mt-0.5">Secure your account with 2FA protection.</p>
                        </div>
                        <div className="w-12 h-6 bg-emerald-600 rounded-full relative p-1 shadow-inner shadow-black/10">
                            <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div>
                            <p className="text-sm font-bold text-gray-900">Login Notifications</p>
                            <p className="text-xs text-gray-400 mt-0.5">Get notified about new logins on other devices.</p>
                        </div>
                        <div className="w-12 h-6 bg-gray-200 rounded-full relative p-1">
                            <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
            <div className="admin-card p-8 bg-white">
                <Store className="w-8 h-8 text-emerald-600 mb-4" />
                <h4 className="text-lg font-bold text-gray-900 mb-2">My Storefront</h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    Update your store logo, description and banner to attract more customers.
                </p>
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-900 rounded-xl font-bold text-sm border border-gray-100 hover:bg-gray-100 transition-colors">
                    Preview Store
                    <ExternalLink className="w-4 h-4 text-emerald-600" />
                </button>
            </div>

            <div className="admin-card p-8 bg-emerald-50 border-emerald-100">
                <h4 className="text-sm font-bold text-emerald-900 mb-3">Compliance Documents</h4>
                <div className="space-y-3">
                    <div className="p-3 bg-white/50 rounded-xl border border-emerald-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800">GST Certificate</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="p-3 bg-white/50 rounded-xl border border-emerald-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800">Bank Verification</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                </div>
                <p className="text-[10px] text-emerald-600/60 mt-4 leading-relaxed">
                    Your documents are verified until **March 2027**. No action required.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
