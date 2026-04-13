import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { fetchSellerProducts } from '../api/auth';
import api from '../api/apiConfig';
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
  Edit3, 
  Trash2, 
  MoreHorizontal,
  Package,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { cn } from '../Utils/cn';

export default function SellerProduct() {
  const { seller } = useOutletContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const navigate = useNavigate();

  const loadProducts = async () => {
    if (!seller?._id) return;
    try {
      setLoading(true);
      const res = await fetchSellerProducts(seller._id);
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [seller]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
        await api.delete(`/api/products/${id}`);
        toast.success("Product deleted successfully");
        loadProducts();
    } catch (err) {
        toast.error("Failed to delete product");
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Product Details',
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
            {row.original.images?.[0] ? (
              <img src={row.original.images[0]} alt={row.original.name} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-6 h-6 text-gray-200" />
            )}
          </div>
          <div>
            <div className="text-gray-900 font-bold text-sm tracking-tight">{row.original.name}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{row.original.category}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => <span className="text-gray-900 font-bold text-sm">₹{row.original.price}</span>
    },
    {
      accessorKey: 'stock',
      header: 'Inventory',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <span>Stock</span>
            <span className={cn(row.original.stock < 10 ? "text-amber-600" : "text-emerald-600")}>
              {row.original.stock} left
            </span>
          </div>
          <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={cn("h-full transition-all duration-1000", row.original.stock < 10 ? "bg-amber-500" : "bg-emerald-500")}
              style={{ width: `${Math.min((row.original.stock / 100) * 100, 100)}%` }}
            />
          </div>
        </div>
      )
    },
    {
       accessorKey: 'amount',
       header: 'Package',
       cell: ({ row }) => <span className="text-gray-500 text-xs font-medium">{row.original.amount} {row.original.unit}</span>
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(`/seller-dashboard/add-product`, { state: { editProduct: row.original } })}
            className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(row.original._id)}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ], []);

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
        <p className="text-gray-500 text-sm font-medium">Synchronizing Inventory...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Product Inventory</h2>
            <p className="text-gray-500 mt-1">Manage and track your store's listings.</p>
        </div>
        <button 
          onClick={() => navigate("/seller-dashboard/add-product")}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-200 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add New Listing
        </button>
      </div>

      <div className="admin-card bg-white p-6">
        <div className="flex items-center justify-between mb-8">
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={globalFilter ?? ''}
                    onChange={e => setGlobalFilter(e.target.value)}
                    placeholder="Filter products by name..."
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
                        <Package className="w-8 h-8 text-emerald-300" />
                    </div>
                    <p className="text-gray-900 font-bold mb-1">No products listed</p>
                    <p className="text-gray-500 text-xs">Start selling by adding your first product to the marketplace.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
