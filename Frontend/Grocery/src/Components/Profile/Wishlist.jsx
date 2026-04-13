import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, Loader2, Star } from 'lucide-react';
import { toggleWishlist } from '../../Redux/wishlistSlice';
import { addToCart } from '../../Redux/cartSlice';
import { toast } from 'react-hot-toast';

const Wishlist = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: products, loading } = useSelector((state) => state.wishlist);

    const handleRemove = (productId) => {
        dispatch(toggleWishlist(productId));
        toast.success("Removed from wishlist");
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        toast.success("Added to cart");
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96">
            <Loader2 size={40} className="text-emerald-500 animate-spin" />
        </div>
    );

    if (!products || products.length === 0) return (
        <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                <Heart size={48} className="text-rose-300" fill="currentColor" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Wishlist is Empty</h3>
            <p className="text-slate-500 max-w-xs mb-8">Save your favorite organic items to find them easily later.</p>
            <button onClick={() => window.location.href = '/'} className="px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-semibold">
                Go Shopping
            </button>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="mb-10">
                <h2 className="text-3xl font-extrabold text-slate-900">Your Wishlist</h2>
                <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest">Inventory of your heart</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product, index) => {
                    const productId = product?._id?.$oid || product?._id || `wishlist-item-${index}`;
                    return (
                        <div 
                            key={productId} 
                            onClick={() => navigate(`/product/${productId}`)}
                            className="group bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 cursor-pointer"
                        >
                            <div className="relative h-48 overflow-hidden bg-slate-50">
                                <img 
                                    src={product.images?.[0] || `https://source.unsplash.com/featured/?grocery,${product.name}`} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 flex flex-col gap-2">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(productId);
                                        }}
                                        className="p-3 bg-white/90 backdrop-blur-md rounded-2xl text-rose-500 shadow-lg hover:bg-rose-500 hover:text-white transition-all scale-100 duration-300"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase text-emerald-600 shadow-sm">
                                        {product.category || 'Organic'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-1 mb-2">
                                    {[1,2,3,4,5].map(s => <Star key={s} size={12} className="fill-amber-400 text-amber-400" />)}
                                    <span className="text-[10px] text-slate-400 font-bold ml-1">(4.8)</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-emerald-600 transition-colors uppercase truncate">{product.name}</h4>
                                <p className="text-sm text-slate-400 line-clamp-2 mb-4 h-10">{product.description || 'Premium quality organic product sourced directly from farmers.'}</p>
                                
                                <div className="flex items-center justify-between mt-auto">
                                    <div>
                                        <span className="text-xs text-slate-400 font-bold">Price</span>
                                        <p className="text-xl font-black text-slate-900">₹{product.price}</p>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(product);
                                        }}
                                        className="p-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                                    >
                                        <ShoppingBag size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Wishlist;
