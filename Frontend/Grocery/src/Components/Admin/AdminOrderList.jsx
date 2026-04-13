import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import { 
  Package, 
  ShoppingBag, 
  Search, 
  Download, 
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminOrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/api/admin/orders/all');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Access Denied or Database Error");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/api/orders/status/${orderId}`, { 
                status: newStatus,
                comment: `Updated to ${newStatus} by System Administrator`
            });
            toast.success("Log updated successfully");
            fetchOrders();
        } catch (err) {
            toast.error("Failed to propagate status");
        }
    };

    const exportToCSV = () => {
        const headers = ["Order ID", "Customer", "Total Amount", "Status", "Payment", "Date"];
        const rows = orders.map(o => [
            o._id,
            o.user_id?.name || 'Guest',
            `Rs.${o.total_amount}`,
            o.status,
            o.payment_status,
            new Date(o.createdAt).toLocaleDateString()
        ]);

        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `platform_orders_report_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Revenue report generated");
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             o.user_id?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || o.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch(status) {
            case 'PLACED': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'PROCESSING': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'SHIPPED': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'DELIVERED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
            <p className="text-slate-400 font-bold tracking-tight">Syncing Transactional Data...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Control Bar */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Financial Records</h2>
                    <p className="text-slate-500 mt-1">Universal order monitoring and status overrides.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Find by ID or Customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-6 py-4 bg-white border border-slate-200 rounded-2xl w-full md:w-64 focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                        />
                    </div>
                    
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                    >
                        <option value="ALL">All Status</option>
                        <option value="PLACED">Placed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                    </select>

                    <button 
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                        <Download size={18} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Registry ID</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Stakeholder</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Economic Value</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Condition</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Lifecycle Controls</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredOrders.map((order) => (
                            <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl border ${getStatusStyle(order.status)}`}>
                                            <Package size={18} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="font-bold text-slate-800">{order.user_id?.name || 'System Guest'}</p>
                                    <p className="text-xs text-slate-400">{order.user_id?.email}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-xl font-black text-slate-900 tracking-tighter">₹{order.total_amount.toLocaleString()}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className={`w-1.5 h-1.5 rounded-full ${order.payment_status === 'PAID' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        <span className={`text-[10px] font-black uppercase ${order.payment_status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {order.payment_status}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ring-4 ring-white shadow-sm ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center justify-center gap-2">
                                        <select 
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            defaultValue={order.status}
                                            className="px-4 py-2 bg-slate-100 border-none rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        >
                                            <option value="PLACED">Placed</option>
                                            <option value="PROCESSING">Process</option>
                                            <option value="SHIPPED">Ship</option>
                                            <option value="DELIVERED">Deliver</option>
                                            <option value="CANCELLED">Cancel</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredOrders.length === 0 && (
                <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                    <ShoppingBag size={48} className="mx-auto text-slate-100 mb-4" />
                    <p className="text-slate-400 font-bold tracking-tight uppercase">Zero results in ledger</p>
                </div>
            )}
        </div>
    );
};

export default AdminOrderList;
