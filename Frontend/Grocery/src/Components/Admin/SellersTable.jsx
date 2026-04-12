import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, Search, Check, X, Store } from 'lucide-react';

export default function SellersTable({ data, onApprove, onReject, isPendingView }) {
  const [globalFilter, setGlobalFilter] = React.useState('');

  const columns = useMemo(() => {
    const baseColumns = [
        {
          accessorKey: 'name',
          header: 'Seller Profile',
          cell: ({ row }) => (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold border border-emerald-100">
                {row.original.name?.[0]}
              </div>
              <div>
                <div className="text-gray-900 font-bold text-sm tracking-tight">{row.original.name}</div>
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{row.original.email}</div>
              </div>
            </div>
          ),
        },
        {
          accessorKey: 'store',
          header: 'Store Details',
          cell: ({ row }) => (
            <div>
              <div className="text-gray-700 font-semibold text-sm">{row.original.store || row.original.name}</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{row.original.city}</div>
            </div>
          ),
        },
        {
            accessorKey: 'phone',
            header: 'Contact',
            cell: ({ row }) => <span className="text-gray-600 font-medium text-sm">{row.original.phone}</span>
        }
    ];

    if (isPendingView) {
        baseColumns.push({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const id = row.original._id.$oid || row.original._id;
                return (
                    <div className="flex items-center gap-2">
                    <button
                        onClick={() => onApprove(id)}
                        className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
                        title="Approve"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onReject(id)}
                        className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                        title="Reject"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    </div>
                )
            },
        });
    } else {
        baseColumns.push({
            id: 'status',
            header: 'Status',
            cell: () => (
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 w-fit text-[10px] font-bold border border-emerald-100 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                </div>
            )
        });
    }

    return baseColumns;
  }, [onApprove, onReject, isPendingView]);

  const table = useReactTable({
    data,
    columns,
    state: {
        globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
        pagination: { pageSize: 5 }
    }
  });

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex items-center justify-between gap-4 px-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Search sellers..."
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

      {/* Actual Table */}
      <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
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
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Store className="w-8 h-8 text-gray-200" />
                </div>
                <p className="text-gray-400 text-sm font-medium">No seller records found in this view.</p>
            </div>
        )}
      </div>
    </div>
  );
}
