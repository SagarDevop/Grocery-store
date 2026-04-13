import React, { useState } from 'react';
import { Star, X, Loader2, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/apiConfig';

const ReviewModal = ({ isOpen, onClose, product, orderId, onReviewSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/reviews', {
        product_id: product.product_id,
        order_id: orderId,
        rating,
        comment
      });
      toast.success("Review posted successfully!");
      onReviewSubmit();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to post review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-emerald-50/30">
          <div>
            <h3 className="text-2xl font-black text-slate-800">Rate this product</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">{product.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-10 space-y-8">
          
          {/* Star Selection */}
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">How was your experience?</p>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(null)}
                  className="transition-transform active:scale-90"
                >
                  <Star 
                    size={48} 
                    fill={(hover || rating) >= star ? "#fbbf24" : "none"} 
                    className={(hover || rating) >= star ? "text-amber-400" : "text-slate-200"}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment input */}
          <div className="space-y-3">
             <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Your feedback</label>
             <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like about this product? How was the freshness?"
                className="w-full h-40 p-6 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white transition-all text-slate-700 font-medium outline-none resize-none"
             />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-xl shadow-emerald-100 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            <span>{loading ? 'Posting...' : 'Submit Review'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};

export default ReviewModal;
