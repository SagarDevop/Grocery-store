import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import MyOrders from './MyOrders';
import Addresses from './Addresses';
import ProfileSettings from './ProfileSettings';
import Wishlist from './Wishlist';

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    { id: 'overview', label: 'Account Overview', icon: ShieldCheck },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
        <p className="text-gray-500 mb-6">Please sign in to access your account dashboard.</p>
        <button onClick={() => window.location.href = '/auth'} className="px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-semibold">
          Sign In Now
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-28">
              {/* User Brief */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white relative">
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full border-4 border-white/30 overflow-hidden mb-4 shadow-lg">
                    <img 
                      src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold truncate w-full text-center">{user.name}</h3>
                  <p className="text-emerald-50 text-sm opacity-90">{user.email}</p>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <User size={80} />
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="p-4 bg-white">
                <div className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                          activeTab === item.id 
                            ? 'bg-emerald-50 text-emerald-600 font-semibold' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <Icon size={20} className={activeTab === item.id ? 'text-emerald-500' : 'text-slate-400 group-hover:text-emerald-400'} />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight size={16} className={`transition-transform ${activeTab === item.id ? 'rotate-90 text-emerald-500' : 'opacity-0 group-hover:opacity-100'}`} />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <button className="w-full flex items-center gap-4 p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all font-medium group">
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Logout</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 min-h-[600px] p-8 animate-fade-in relative overflow-hidden">
               {activeTab === 'overview' && (
                 <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-black text-slate-900">Dashboard</h2>
                      <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-1 rounded-full uppercase tracking-widest">Premium User</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { label: 'Total Orders', value: '12', color: 'bg-blue-500' },
                        { label: 'Wishlist Items', value: '8', color: 'bg-rose-500' },
                        { label: 'Saved Addresses', value: user.addresses?.length || 0, color: 'bg-amber-500' },
                      ].map((stat, i) => (
                        <div key={i} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                          <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <h4 className="font-bold text-slate-800 flex items-center gap-2">
                             <MapPin size={18} className="text-emerald-500" />
                             Primary Shipping
                          </h4>
                          {user.addresses?.find(a => a.isDefault) ? (
                            <div className="p-6 bg-white border-2 border-emerald-500 rounded-3xl">
                               <p className="font-bold text-slate-800">{user.addresses.find(a => a.isDefault).label}</p>
                               <p className="text-slate-500 text-sm mt-1">{user.addresses.find(a => a.isDefault).street}</p>
                            </div>
                          ) : (
                            <div className="p-6 bg-slate-50 rounded-3xl text-center border-2 border-dashed border-slate-200">
                               <p className="text-slate-400 text-sm">No primary address set</p>
                            </div>
                          )}
                       </div>

                        <div className="space-y-4">
                           <h4 className="font-bold text-slate-800 flex items-center gap-2">
                              <ShoppingBag size={18} className="text-emerald-500" />
                              Latest History
                           </h4>
                           <div className="flex flex-wrap gap-4">
                              {(user.recently_viewed || []).length > 0 ? (
                                user.recently_viewed.map((item, idx) => (
                                  <div 
                                    key={idx} 
                                    onClick={() => window.location.href = `/product/${item._id}`}
                                    className="w-16 h-16 bg-white rounded-2xl overflow-hidden border border-slate-200 cursor-pointer hover:border-emerald-500 hover:ring-2 hover:ring-emerald-500/10 transition-all shadow-sm group"
                                    title={item.name}
                                  >
                                     <img 
                                        src={item.images?.[0] || `https://source.unsplash.com/featured/?grocery,${item.name}`} 
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                     />
                                  </div>
                                ))
                              ) : (
                                <div className="w-full py-6 bg-slate-50 rounded-2xl text-center border border-slate-100 border-dashed">
                                   <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Registry Empty</p>
                                </div>
                              )}
                           </div>
                        </div>
                    </div>
                 </div>
               )}
               {activeTab === 'orders' && <MyOrders />}
               {activeTab === 'addresses' && <Addresses />}
               {activeTab === 'profile' && <ProfileSettings />}
               {activeTab === 'wishlist' && <Wishlist />}
               {activeTab === 'settings' && (
                 <div className="flex flex-col items-center justify-center h-[500px] text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                      <Settings size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Account Settings</h2>
                    <p className="text-slate-500 max-w-sm">Manage your account security and notification preferences here.</p>
                 </div>
               )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
