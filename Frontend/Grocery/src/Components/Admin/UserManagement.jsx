import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import { 
  Users, 
  Shield, 
  UserPlus, 
  Trash2, 
  Mail, 
  Calendar,
  Search,
  MoreVertical,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/api/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async (userId, isAdmin, role) => {
        setUpdatingId(userId);
        try {
            await api.put(`/api/admin/user/${userId}`, { is_admin: isAdmin, role });
            toast.success("User status updated");
            fetchUsers();
        } catch (err) {
            toast.error("Action failed");
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
            <p className="text-slate-400 font-bold tracking-tight">Accessing Central User Registry...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Platform Users</h2>
                    <p className="text-slate-500 mt-1">Manage administrative permissions and user accounts.</p>
                </div>
                
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[20px] w-full md:w-80 shadow-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none font-medium"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Identity</th>
                            <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Position</th>
                            <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Access Key</th>
                            <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Registry Date</th>
                            <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Commands</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black shadow-inner">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 leading-none mb-1">{user.name}</p>
                                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                                <Mail size={12} /> {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        {user.is_admin ? (
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider rounded-lg border border-indigo-100 flex items-center gap-1">
                                                <Shield size={10} /> Admin Panel
                                            </span>
                                        ) : user.role === 'seller' ? (
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider rounded-lg border border-emerald-100">
                                                Vendor Access
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider rounded-lg">
                                                Consumer
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6 font-mono text-xs text-slate-300">
                                    {user._id.slice(-8).toUpperCase()}
                                </td>
                                <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-slate-300" />
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {user.role === 'user' && (
                                            <button 
                                                onClick={() => handleUpdateRole(user._id, false, 'seller')}
                                                className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-emerald-500 hover:border-emerald-200 rounded-xl transition-all"
                                                title="Grant Vendor Access"
                                            >
                                                <UserPlus size={18} />
                                            </button>
                                        )}
                                        {!user.is_admin && (
                                            <button 
                                                onClick={() => handleUpdateRole(user._id, true, user.role)}
                                                className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-indigo-500 hover:border-indigo-200 rounded-xl transition-all"
                                                title="Grant Admin Rights"
                                            >
                                                <Shield size={18} />
                                            </button>
                                        )}
                                        <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-200 rounded-xl transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredUsers.length === 0 && (
                <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                    <Users size={48} className="mx-auto text-slate-100 mb-4" />
                    <p className="text-slate-400 font-bold">No users match your criteria</p>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
