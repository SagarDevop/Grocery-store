import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { fetchPendingSellers, fetchSellers, approveSeller, rejectSeller } from "../api/auth";
import SellersTable from "../Components/Admin/SellersTable";
import { cn } from "../Utils/cn";

export default function PendingSellers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('pending'); // 'pending' or 'active'

  const fetchData = async () => {
    try {
        setLoading(true);
        const res = viewMode === 'pending' ? await fetchPendingSellers() : await fetchSellers();
        setData(res.data);
    } catch (err) {
        toast.error(`Failed to fetch ${viewMode} list`);
    } finally {
        setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
        await approveSeller(id);
        toast.success("Seller approved");
        fetchData();
    } catch (err) {
        toast.error("Approval failed");
    }
  };

  const handleReject = async (id) => {
    try {
        await rejectSeller(id);
        toast("Seller rejected", { icon: "❌" });
        fetchData();
    } catch (err) {
        toast.error("Rejection failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, [viewMode]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* View Switcher Tabs */}
        <div className="flex p-1 bg-gray-100/80 rounded-xl w-fit border border-gray-200">
            <button 
                onClick={() => setViewMode('pending')}
                className={cn(
                    "px-6 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest",
                    viewMode === 'pending' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
            >
                Pending Requests
            </button>
            <button 
                onClick={() => setViewMode('active')}
                className={cn(
                    "px-6 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest",
                    viewMode === 'active' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
            >
                Active Sellers
            </button>
        </div>

        {loading ? (
            <div className="p-12 text-center bg-white/50 rounded-2xl border border-gray-100">
                <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 text-sm font-medium">Fetching {viewMode} sellers...</p>
            </div>
        ) : (
            <div className="admin-card overflow-hidden">
                <SellersTable 
                    data={data} 
                    onApprove={handleApprove} 
                    onReject={handleReject}
                    isPendingView={viewMode === 'pending'} 
                />
            </div>
        )}
    </div>
  );
}
