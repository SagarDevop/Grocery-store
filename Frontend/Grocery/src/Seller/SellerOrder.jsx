import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { fetchSellerOrders } from '../api/auth';
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender, 
  getPaginationRowModel, 
  getSortedRowModel, 
  getFilteredRowModel 
} from '@tanstack/react-table';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Eye,
  ShoppingBag,
  ExternalLink,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../Utils/cn';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => {
    const config = {
        'PENDING': { color: 'bg-amber-50 text-amber-700 border-amber-100', icon: Clock },
        'PLACED': { color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: ShoppingBag },
        'CONFIRMED': { color: 'bg-blue-50 text-blue-700 border-blue-100', icon: CheckCircle2 },
        'SHIPPED': { color: 'bg-purple-50 text-purple-700 border-purple-100', icon: Truck },
        'DELIVERED': { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
        'CANCELLED': { color: 'bg-red-50 text-red-700 border-red-100', icon: AlertCircle },
    };

    const { color, icon: Icon } = config[status] || config['PENDING'];

    return (
        <div className={cn("px-3 py-1.5 rounded-xl border text-[10px] font-bold flex items-center gap-1.5 w-fit uppercase tracking-widest", color)}>
            <Icon className="w-3 h-3" />
            {status}
        </div>
    );
};

export default function SellerOrder() {
  const { seller } = useOutletContext();
  const user = useSelector((state) => state.auth.user);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');

  const loadOrders = async () => {
    if (!seller?._id) return;
    try {
      setLoading(true);
      const res = await fetchSellerOrders(seller._id);
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [seller]);

  const columns = useMemo(() => [
    {
      accessorKey: '_id',
      header: 'Order Details',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-gray-900 font-bold text-sm tracking-tight">#{row.original._id.slice(-8).toUpperCase()}</span>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
            {format(new Date(row.original.createdAt), 'MMM dd, yyyy • hh:mm a')}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'user_id.name',
      header: 'Customer',
      cell: ({ row }) => (
        <div className="flex flex-col">
            <span className="text-gray-900 font-bold text-sm">{row.original.user_id?.name || 'Guest'}</span>
            <span className="text-xs text-gray-500 font-medium">{row.original.user_id?.email || 'No Email'}</span>
        </div>
      )
    },
    {
      accessorKey: 'items',
      header: 'Your Items',
      cell: ({ row }) => {
        // Filter items belonging to this seller
        const sellerItems = row.original.items.filter(item => item.seller_id === user._id);
        return (
            <div className="flex flex-col gap-1">
                <span className="text-gray-900 font-bold text-sm">{sellerItems.length} Products</span>
                <div className="flex -space-x-2">
                    {sellerItems.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="w-6 h-6 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-400 overflow-hidden">
                            {item.name[0]}
                        </div>
                    ))}
                    {sellerItems.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-emerald-50 border-2 border-white flex items-center justify-center text-[8px] font-bold text-emerald-600">
                            +{sellerItems.length - 3}
                        </div>
                    )}
                </div>
            </div>
        );
      }
    },
    {
      accessorKey: 'total_amount',
      header: 'Total Value',
      cell: ({ row }) => {
         const sellerItems = row.original.items.filter(item => item.seller_id === user._id);
         const sellerValue = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
         return <span className="text-emerald-700 font-bold text-sm">₹{sellerValue.toLocaleString()}</span>;
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />
    },
    {
      id: 'actions',
      header: 'View',
      cell: ({ row }) => (
        <button 
          className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all border border-gray-100"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      ),
    },
  ], [user._id]);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 6 } }
  });

  if (loading) return (
    <div className="p-20 text-center animate-in fade-in duration-500">
        <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm font-medium">Fetching Orders...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Order Tracking</h2>
            <p className="text-gray-500 mt-1">Monitor and fulfill customer requests effortlessly.</p>
        </div>
      </div>

      <div className="admin-card bg-white p-6">
        <div className="flex items-center justify-between mb-8">
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={globalFilter ?? ''}
                    onChange={e => setGlobalFilter(e.target.value)}
                    placeholder="Search by order ID or customer..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-gray-400"
                />
            </div>

            <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mr-2">
                    Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
                </span>
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-emerald-600 disabled:opacity-20 transition-all border border-gray-100"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-emerald-600 disabled:opacity-20 transition-all border border-gray-100"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>

        <div className="overflow-hidden bg-white rounded-2xl border border-gray-100">
            <table className="w-full text-left border-collapse">
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-gray-50/50">
                    {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                    ))}
                </tr>
                ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
                {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="group hover:bg-emerald-50/30 transition-colors">
                    {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
            </table>
            
            {data.length === 0 && (
                <div className="p-20 text-center">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                        <ShoppingBag className="w-8 h-8 text-emerald-300" />
                    </div>
                    <p className="text-gray-900 font-bold mb-1">No orders yet</p>
                    <p className="text-gray-500 text-xs">When customers buy your products, they will appear here.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
