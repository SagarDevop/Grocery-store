import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  CheckCircle2, 
  ChevronLeft,
  Loader2,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { clearCart } from '../Redux/cartSlice';
import api from '../api/apiConfig';

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const cart = useSelector((state) => state.cart.items);
    
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('CARD');

    // 🎟️ Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    // 🚚 Dynamic Delivery Fee (Growth logic: Free over 500)
    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const total = subtotal - discountAmount + deliveryFee;

    useEffect(() => {
        if (!user) navigate('/auth');
        fetchProfile();
    }, [user]);

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsValidatingCoupon(true);
        try {
            const res = await api.post('/api/coupons/validate', {
                code: couponCode,
                orderAmount: subtotal
            });
            setDiscountAmount(res.data.discountAmount);
            setAppliedCoupon(res.data.couponCode);
            toast.success(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.error || "Invalid coupon");
            setDiscountAmount(0);
            setAppliedCoupon(null);
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    const fetchProfile = async () => {
        try {
            const res = await api.get('/api/user/profile');
            setAddresses(res.data.addresses || []);
            const defaultAddr = res.data.addresses?.find(a => a.isDefault);
            if (defaultAddr) setSelectedAddress(defaultAddr);
        } catch (err) {
            console.error(err);
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCheckout = async () => {
        if (!selectedAddress) {
            toast.error("Please select a shipping address");
            return;
        }

        setLoading(true);

        try {
            if (paymentMethod === 'CARD') {
                const isLoaded = await loadRazorpayScript();
                if (!isLoaded) {
                    toast.error("Razorpay SDK failed to load. Are you online?");
                    setLoading(false);
                    return;
                }

                // 1. Create Order in Backend
                const orderRes = await api.post('/api/create-payment-order', {
                    amount: total,
                    items: cart,
                    shipping_address: selectedAddress,
                    coupon_code: appliedCoupon
                });

                if (!orderRes.data.success) throw new Error("Payment initialization failed");

                const { order, key, internal_order_id } = orderRes.data;

                // 2. Open Razorpay Modal
                const options = {
                    key, 
                    amount: order.amount,
                    currency: order.currency,
                    name: "GreenCart Organic",
                    description: "Premium Grocery Transaction",
                    order_id: order.id,
                    handler: async (response) => {
                        try {
                            setLoading(true);
                            // 3. Verify Payment
                            const verifyRes = await api.post('/api/verify-payment', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                internal_order_id
                            });

                            if (verifyRes.data.success) {
                                toast.success("Payment successful!");
                                dispatch(clearCart());
                                setStep(3);
                            }
                        } catch (err) {
                            toast.error(err.response?.data?.error || "Verification failed");
                        } finally {
                            setLoading(false);
                        }
                    },
                    prefill: {
                        name: user.name,
                        email: user.email,
                    },
                    theme: { color: "#10b981" },
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();

            } else {
                // Handling Cash on Delivery or other methods
                const res = await api.post('/api/orders/checkout', {
                    shipping_address: selectedAddress,
                    payment_method: paymentMethod,
                    coupon_code: appliedCoupon
                });
                
                toast.success("Order placed successfully!");
                dispatch(clearCart());
                setStep(3);
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Transaction failed");
        } finally {
            setLoading(false);
        }
    };

    const ProgressHeader = () => (
        <div className="flex items-center justify-center gap-4 mb-12">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-md ${
                        step >= s ? 'bg-emerald-600 text-white scale-110' : 'bg-slate-100 text-slate-400'
                    }`}>
                        {step > s ? <CheckCircle2 size={20} /> : s}
                    </div>
                    {s < 3 && <div className={`w-20 h-1 rounded-full transition-all ${step > s ? 'bg-emerald-500' : 'bg-slate-100'}`} />}
                </div>
            ))}
        </div>
    );

    if (step === 3) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20 pb-12 px-4">
            <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce pt-2">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">Order Confirmed!</h2>
                <p className="text-slate-500 mb-8 font-medium leading-relaxed">
                    Thank you for your purchase. We've started preparing your organic groceries for delivery.
                </p>
                <div className="space-y-4">
                    <button 
                        onClick={() => navigate('/profile')} 
                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100"
                    >
                        Track My Order
                    </button>
                    <button 
                        onClick={() => navigate('/')} 
                        className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition"
                    >
                        Back to Shopping
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                
                <button 
                    onClick={() => step > 1 ? setStep(step - 1) : navigate('/cart')}
                    className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors font-bold mb-8 group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>{step === 1 ? 'Back to Cart' : 'Back to Address'}</span>
                </button>

                <ProgressHeader />

                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Main Content */}
                    <div className="lg:w-2/3 space-y-8">
                        {step === 1 ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-black text-slate-900">Select Address</h2>
                                    <button 
                                        onClick={() => navigate('/profile')} 
                                        className="text-emerald-600 text-sm font-bold hover:underline"
                                    >
                                        + Manage Addresses
                                    </button>
                                </div>
                                
                                {/* Order Review (New Section) */}
                                <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100">
                                   <h3 className="text-sm font-black uppercase tracking-widest text-emerald-800 mb-4 flex items-center gap-2">
                                      <ShoppingBag size={14} /> Review Your Items
                                   </h3>
                                   <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                      {cart.map((item, idx) => (
                                          <div key={idx} className="flex-shrink-0 w-24 text-center group">
                                             <div className="w-20 h-20 mx-auto bg-white rounded-2xl overflow-hidden border border-emerald-100 shadow-sm relative group-hover:border-emerald-400 transition-all">
                                                <img 
                                                   src={item.image || (item.images && item.images[0]) || `https://source.unsplash.com/featured/?grocery,${item.name}`} 
                                                   alt={item.name}
                                                   className="w-full h-full object-cover"
                                                />
                                                <div className="absolute top-1 right-1 bg-emerald-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                                   {item.quantity}
                                                </div>
                                             </div>
                                             <p className="text-[10px] font-bold text-slate-600 mt-2 truncate w-full">{item.name}</p>
                                          </div>
                                      ))}
                                   </div>
                                </div>

                                <div className="grid gap-4">
                                    {addresses.map((addr) => (
                                        <div 
                                            key={addr._id}
                                            onClick={() => setSelectedAddress(addr)}
                                            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative ${
                                                selectedAddress?._id === addr._id 
                                                    ? 'border-emerald-500 bg-emerald-50/30' 
                                                    : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center ${
                                                    selectedAddress?._id === addr._id ? 'border-emerald-500' : 'border-slate-200'
                                                }`}>
                                                    {selectedAddress?._id === addr._id && <div className="w-2 h-2 bg-emerald-500 rounded-full" />}
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{addr.label}</span>
                                                    <p className="font-bold text-slate-800 mt-1">{addr.street}</p>
                                                    <p className="text-slate-500 text-sm">{addr.city}, {addr.state} - {addr.zip}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {addresses.length === 0 && (
                                        <div className="p-12 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                                            <MapPin size={40} className="text-slate-200 mx-auto mb-4" />
                                            <p className="text-slate-400 font-bold">No addresses found in your profile</p>
                                            <button onClick={() => navigate('/profile')} className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold">Add Address</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-6">Payment Method</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { id: 'CARD', label: 'Credit/Debit Card', icon: CreditCard },
                                            { id: 'COD', label: 'Cash on Delivery', icon: Truck },
                                        ].map((method) => (
                                            <div 
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                                                    paymentMethod === method.id ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 bg-white'
                                                }`}
                                            >
                                                <div className={`p-3 rounded-2xl ${paymentMethod === method.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                    <method.icon size={24} />
                                                </div>
                                                <span className="font-bold text-slate-800">{method.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-4 p-6 bg-slate-900 rounded-[32px] text-white overflow-hidden relative">
                                        <div className="relative z-10">
                                            <ShieldCheck size={40} className="text-emerald-400 mb-2" />
                                            <p className="font-bold text-lg uppercase tracking-tight">Secured checkout</p>
                                            <p className="text-slate-400 text-sm">Your data is protected by industry standard encryption.</p>
                                        </div>
                                        <div className="absolute -right-10 -bottom-10 opacity-10">
                                            <ShieldCheck size={180} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sticky top-32 overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[100px] -z-0" />
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                                    <ShoppingBag size={20} className="text-emerald-500" />
                                    Order Summary
                                </h3>
                                
                                <div className="space-y-4 mb-8">
                                    {cart.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 font-medium truncate w-2/3">{item.quantity} × {item.name}</span>
                                            <span className="text-slate-800 font-bold">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-dashed border-slate-200 space-y-4">
                                    {/* 🎟️ Coupon Input Field */}
                                    <div className="mb-6">
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                placeholder="Coupon Code" 
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                disabled={appliedCoupon}
                                                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 outline-none uppercase font-bold"
                                            />
                                            <button 
                                                onClick={appliedCoupon ? () => { setAppliedCoupon(null); setDiscountAmount(0); setCouponCode(''); } : handleApplyCoupon}
                                                disabled={isValidatingCoupon}
                                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition ${
                                                    appliedCoupon 
                                                    ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                                                    : 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700'
                                                }`}
                                            >
                                                {isValidatingCoupon ? '...' : appliedCoupon ? 'Remove' : 'Apply'}
                                            </button>
                                        </div>
                                        {appliedCoupon && (
                                            <p className="text-[10px] text-emerald-600 font-bold mt-2 ml-1 flex items-center gap-1">
                                                <CheckCircle2 size={10} /> CODE {appliedCoupon} APPLIED
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Subtotal</span>
                                        <span className="text-slate-800 font-bold">₹{subtotal}</span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-emerald-600 font-medium">Discount</span>
                                            <span className="text-emerald-600 font-black">-₹{discountAmount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Delivery</span>
                                        {deliveryFee === 0 ? (
                                            <span className="text-emerald-600 font-black uppercase tracking-widest text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full">Free</span>
                                        ) : (
                                            <span className="text-slate-800 font-bold">₹{deliveryFee}</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between text-xl font-black text-slate-900 pt-4">
                                        <span>Total</span>
                                        <span>₹{total}</span>
                                    </div>
                                </div>

                                {step === 1 ? (
                                    <button 
                                        onClick={() => selectedAddress ? setStep(2) : toast.error("Select an address")}
                                        className="w-full mt-10 py-5 bg-emerald-600 text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-xl shadow-emerald-100"
                                    >
                                        Select Payment
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleCheckout}
                                        disabled={loading}
                                        className="w-full mt-10 py-5 bg-emerald-600 text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-xl shadow-emerald-100 flex items-center justify-center gap-3"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
                                        <span>{loading ? 'Processing...' : 'Complete Purchase'}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
