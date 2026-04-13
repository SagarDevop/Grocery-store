import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Save, 
  Loader2,
  CheckCircle2,
  Lock,
  KeyRound,
  Shield
} from 'lucide-react';
import api from '../../api/apiConfig';
import { setUser } from '../../Redux/authSlice';
import { toast } from 'react-hot-toast';

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/api/user/profile', formData);
      dispatch(setUser(formData)); // Sync with global state
      toast.success("Identity updated successfully");
    } catch (err) {
      toast.error("Cloud synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
        return toast.error("Verification mismatch");
    }
    setPasswordLoading(true);
    try {
        await api.put('/api/user/change-password', {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
        });
        toast.success("Security keys updated");
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
        toast.error(err.response?.data?.error || "Re-authentication failed");
    } finally {
        setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-16 animate-in fade-in duration-700 pb-20">
      {/* Identity Profile */}
      <section>
        <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Personal Identity</h2>
            <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest">Public profile details</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-slate-50 rounded-[40px] border border-slate-100 shadow-sm">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-[32px] overflow-hidden border-4 border-white shadow-xl shadow-slate-200">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff&bold=true`} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div className="text-center md:text-left">
                    <h4 className="font-black text-slate-900 text-xl tracking-tight">{user?.name}</h4>
                    <p className="text-sm text-slate-500 mb-6 font-medium">Standard Marketplace Citizen</p>
                    <div className="flex flex-wrap gap-2">
                        <button type="button" className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                            Upload Photo
                        </button>
                        <button type="button" className="px-6 py-2 bg-white border border-slate-200 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                            Remove
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">
                        <User size={12} className="text-emerald-500" /> Full Legal Name
                    </label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-8 py-5 bg-white border border-slate-200 rounded-[28px] focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-bold text-slate-800 outline-none shadow-sm"
                        placeholder="Consumer Name"
                    />
                </div>

                <div className="opacity-60">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">
                        <Mail size={12} /> Registry Email
                    </label>
                    <div className="relative">
                        <input 
                            type="email" 
                            value={formData.email}
                            disabled
                            className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[28px] text-slate-400 font-bold cursor-not-allowed"
                        />
                        <CheckCircle2 size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-400" />
                    </div>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">
                        <Phone size={12} className="text-emerald-500" /> Secure Phone
                    </label>
                    <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-8 py-5 bg-white border border-slate-200 rounded-[28px] focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-bold text-slate-800 outline-none shadow-sm"
                        placeholder="+91 XXXXX XXXXX"
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="flex items-center gap-4 px-12 py-5 bg-slate-900 text-white rounded-[28px] font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                <span>Synchronize Identity</span>
            </button>
        </form>
      </section>

      {/* Security Section */}
      <section className="pt-16 border-t border-slate-100">
        <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Security & Protocol</h2>
            <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest">Master password rotation</p>
        </div>

        <form onSubmit={handlePasswordChange} className="bg-white p-10 rounded-[44px] border border-slate-100 shadow-xl shadow-slate-50 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2 block">Current Cipher</label>
                    <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input 
                            type="password" 
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold outline-none"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2 block">New Access Key</label>
                    <div className="relative">
                        <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input 
                            type="password" 
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold outline-none"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2 block">Verify Protocol</label>
                    <input 
                        type="password" 
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold outline-none"
                        required
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={passwordLoading}
                className="flex items-center gap-4 px-12 py-5 bg-indigo-600 text-white rounded-[28px] font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
            >
                {passwordLoading ? <Loader2 className="animate-spin" size={16} /> : <Shield size={16} />}
                <span>Rotate Security Keys</span>
            </button>
        </form>
      </section>
    </div>
  );
};

export default ProfileSettings;
