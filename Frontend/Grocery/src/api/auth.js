import api from "./apiConfig";

export const signup = (data) => api.post(`/signup`, data);

export const login = (data) => api.post(`/login`, data);

export const verifyOTP = (data) => api.post(`/verify-otp`, data);

export const googleLogin = (token) => api.post(`/google-login`, { token });

export const fetchAdminStats = () => api.get(`/api/admin/stats`);

export const fetchAdminActivity = () => api.get(`/api/admin/activity`);

export const Allproduct = (params = {}) => api.get(`/api/products`, { params });

export const forgotPassword = (email) =>
  api.post(`/forgot-password`, { email });

export const resetPassword = ({ email, otp, new_password }) =>
  api.post(`/reset-password`, {
    email,
    otp,
    new_password,
  });

export const registerSeller = (data) =>
  api.post(`/api/seller/register-seller`, data);

export const fetchPendingSellers = () =>
  api.get(`/api/seller/pending-sellers`);

export const approveSeller = (id) =>
  api.post(`/api/seller/approve-seller/${id}`);

export const rejectSeller = (id) =>
  api.delete(`/api/seller/reject-seller/${id}`);

export const fetchSellers = () =>
  api.get(`/api/seller/sellers`);

export const fetchSellerProducts = (sellerId) =>
  api.get(`/api/seller/products/${sellerId}`);

export const fetchSellerOrders = (sellerId) =>
  api.get(`/api/seller/orders/${sellerId}`);

// Wishlist Endpoints
export const getWishlist = () => api.get(`/api/wishlist`);
export const toggleWishlist = (productId) => api.post(`/api/wishlist/toggle`, { productId });




