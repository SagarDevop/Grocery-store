import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertCircle
} from 'lucide-react';

import ReviewModal from './ReviewModal';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const handleReviewClick = (product, orderId) => {
    setSelectedProduct(product);
    setCurrentOrderId(orderId);
    setShowReviewModal(true);
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders/my-orders');
      setOrders(res.data);
    } catch (err) {
      console.error("Orders Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-600';
      case 'SHIPPED': return 'bg-blue-100 text-blue-600';
      case 'PROCESSING': return 'bg-amber-100 text-amber-600';
      case 'PLACED': return 'bg-indigo-100 text-indigo-600';
      case 'CANCELLED': return 'bg-rose-100 text-rose-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium">Fetching your orders...</p>
    </div>
  );

  if (orders.length === 0) return (
    <div className="flex flex-col items-center justify-center h-96 text-center">
      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
        <Package size={48} className="text-slate-300" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">No Orders Found</h3>
      <p className="text-slate-500 max-w-xs mb-8">Looks like you haven't placed any orders yet. Start shopping to see them here!</p>
      <button onClick={() => window.location.href = '/'} className="px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 font-semibold">
        Explore Products
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Order History</h2>
          <p className="text-slate-500 mt-1">Manage and track your recent purchases</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold border border-emerald-100">
          {orders.length} Orders
        </div>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => (
          <div 
            key={order._id} 
            className="group bg-white border border-slate-200 rounded-3xl transition-all duration-300 hover:shadow-xl hover:border-emerald-200 overflow-hidden"
          >
            {/* Order Summary Row */}
            <div 
              className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${getStatusColor(order.status)}`}>
                  {order.status === 'DELIVERED' ? <CheckCircle2 size={24} /> : <Truck size={24} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">Order #{order._id.slice(-8).toUpperCase()}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Total Amount</p>
                  <p className="text-xl font-black text-slate-900">₹{order.total_amount.toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-center md:items-end">
                   <span className={`px-4 py-1.5 rounded-full text-xs font-bold ring-1 ring-inset ${getStatusColor(order.status)} ring-current/20`}>
                    {order.status}
                  </span>
                  <button className="mt-2 text-emerald-500 flex items-center gap-1 text-sm font-bold hover:underline">
                    {expandedOrder === order._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedOrder === order._id && (
              <div className="border-t border-slate-100 bg-slate-50/50 p-8 animate-slide-down">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  
                  {/* Item List */}
                  <div className="lg:col-span-2 space-y-4">
                    <h5 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                      <Package size={18} className="text-emerald-500" />
                      Ordered Items
                    </h5>
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border-b last:border-0 border-slate-50 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                               <img 
                                src={`https://source.unsplash.com/featured/?grocery,${item.name}`} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                               />
                            </div>
                           <div>
                              <p className="font-bold text-slate-800">{item.name}</p>
                              <p className="text-sm text-slate-500">Qty: {item.quantity} × ₹{item.price}</p>
                              {order.status === 'DELIVERED' && (
                                <button 
                                  onClick={() => handleReviewClick(item, order._id)}
                                  className="mt-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center gap-1"
                                >
                                  <Star size={10} fill="currentColor" /> Rate & Review
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="font-bold text-slate-900">₹{item.quantity * item.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  <div>
                    <h5 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                      <Truck size={18} className="text-emerald-500" />
                      Tracking Details
                    </h5>
                    <div className="relative pl-6 space-y-8 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                      {(order.timeline || [
                        { status: 'PLACED', comment: 'Order confirmed' },
                        { status: 'PROCESSING', comment: 'Warehouse processing' }
                      ]).map((step, idx) => (
                        <div key={idx} className="relative group/step">
                          <div className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white transition-colors shadow-sm ${idx === 0 ? 'bg-emerald-500 ring-4 ring-emerald-50' : 'bg-slate-300'}`} />
                          <div className="flex flex-col">
                            <span className={`text-sm font-bold ${idx === 0 ? 'text-emerald-600' : 'text-slate-600'}`}>{step.status}</span>
                            <span className="text-xs text-slate-400 mt-0.5">{step.comment}</span>
                            <span className="text-[10px] text-slate-300 mt-1">2 mins ago</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 p-4 bg-white rounded-2xl border border-slate-100">
                      <p className="text-xs text-slate-400 font-bold uppercase mb-2">Shipping to</p>
                      <p className="text-sm text-slate-700 font-medium">
                        {order.shipping_address.street}, {order.shipping_address.city}<br/>
                        {order.shipping_address.state} - {order.shipping_address.zip}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {selectedProduct && (
        <ReviewModal 
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          product={selectedProduct}
          orderId={currentOrderId}
          onReviewSubmit={fetchOrders}
        />
      )}
    </div>
  );
};

export default MyOrders;
