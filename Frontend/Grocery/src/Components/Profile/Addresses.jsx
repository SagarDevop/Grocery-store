import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Plus, 
  MapPin, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Home, 
  Briefcase,
  Map as MapIcon,
  X,
  Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { setUser } from '../../Redux/authSlice';
import api from '../../api/apiConfig';

const Addresses = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    zip: '',
    isDefault: false
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/user/profile');
      setAddresses(res.data.addresses || []);
    } catch (err) {
      console.error("Profile Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, addressId = null, extraData = null) => {
    setSubmitting(true);
    try {
      const res = await api.post('/api/user/address', {
        action,
        addressId,
        addressData: extraData || formData
      });
      
      setAddresses(res.data.addresses);
      dispatch(setUser({ addresses: res.data.addresses })); // Sync with global user state
      toast.success(`Address ${action.toLowerCase()}ed successfully`);
      setShowModal(false);
      resetForm();
    } catch (err) {
        toast.error("Failed to update address");
        console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ label: 'Home', street: '', city: '', state: '', zip: '', isDefault: false });
    setEditingAddress(null);
  };

  const openEdit = (addr) => {
    setFormData({
      label: addr.label,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      isDefault: addr.isDefault
    });
    setEditingAddress(addr._id);
    setShowModal(true);
  };

  if (loading) return (
     <div className="flex flex-col items-center justify-center h-96">
      <Loader2 size={40} className="text-emerald-500 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Address Book</h2>
          <p className="text-slate-500 mt-1">Manage your shipping destinations</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all font-bold shadow-lg shadow-emerald-100"
        >
          <Plus size={20} />
          <span>Add New Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div 
            key={addr._id} 
            className={`relative p-6 rounded-3xl border-2 transition-all duration-300 ${
              addr.isDefault 
                ? 'border-emerald-500 bg-emerald-50/30' 
                : 'border-slate-100 bg-white hover:border-slate-300'
            }`}
          >
            {addr.isDefault && (
              <div className="absolute -top-3 left-6 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-md">
                Primary Choice
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${addr.isDefault ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {addr.label === 'Home' ? <Home size={20} /> : addr.label === 'Office' ? <Briefcase size={20} /> : <MapIcon size={20} />}
                </div>
                <h4 className="font-bold text-slate-800 text-lg">{addr.label}</h4>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(addr)} className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all">
                  <Edit3 size={18} />
                </button>
                <button onClick={() => handleAction('DELETE', addr._id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <p className="text-slate-600 font-medium mb-1">{addr.street}</p>
            <p className="text-slate-500 text-sm">{addr.city}, {addr.state} - {addr.zip}</p>

            {!addr.isDefault && (
              <button 
                onClick={() => handleAction('SET_DEFAULT', addr._id)}
                className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-bold hover:bg-slate-50 transition-all"
              >
                Set as Default
              </button>
            )}
            
            {addr.isDefault && (
               <div className="mt-6 flex items-center justify-center gap-2 py-2.5 text-emerald-600 text-sm font-bold">
                  <CheckCircle2 size={16} />
                  <span>Default Shipping Address</span>
               </div>
            )}
          </div>
        ))}

        {addresses.length === 0 && (
          <div className="md:col-span-2 flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
             <MapPin size={48} className="text-slate-200 mb-4" />
             <p className="text-slate-400 font-medium tracking-tight">Your address book is empty</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">{editingAddress ? 'Update Address' : 'Add New Address'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-full transition-all text-slate-400">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleAction(editingAddress ? 'UPDATE' : 'ADD', editingAddress); }} className="p-8 space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {['Home', 'Office', 'Other'].map(l => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setFormData({...formData, label: l})}
                    className={`py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                      formData.label === l 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-600' 
                        : 'border-slate-100 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Street Address</label>
                <input 
                  type="text" 
                  value={formData.street} 
                  onChange={(e) => setFormData({...formData, street: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium"
                  placeholder="Street name, landmark, etc."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">City</label>
                  <input 
                    type="text" 
                    value={formData.city} 
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium"
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">State</label>
                  <input 
                    type="text" 
                    value={formData.state} 
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium"
                    placeholder="State"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                 <div className="w-1/2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Zip Code</label>
                  <input 
                    type="text" 
                    value={formData.zip} 
                    onChange={(e) => setFormData({...formData, zip: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-medium"
                    placeholder="Pincode"
                    required
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer group mt-6">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                    />
                    <div className="w-12 h-6 bg-slate-200 rounded-full peer-checked:bg-emerald-500 transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-all shadow-sm"></div>
                  </div>
                  <span className="text-sm font-bold text-slate-600">Primary?</span>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-100 disabled:opacity-50 mt-4"
              >
                {submitting ? <Loader2 className="animate-spin" /> : editingAddress ? 'Update Destination' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;
