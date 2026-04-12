import api from "./apiConfig";

export const signup = (data) => api.post(`/signup`, data);

export const login = (data) => api.post(`/login`, data);

export const verifyOTP = (data) => api.post(`/verify-otp`, data);

export const googleLogin = (token) => api.post(`/google-login`, { token });

export const fetchAdminStats = () => api.get(`/admin/stats`);

export const fetchAdminActivity = () => api.get(`/admin/activity`);

export const Allproduct = () => api.get(`/products`);

export const forgotPassword = (email) =>
  api.post(`/forgot-password`, { email });

export const resetPassword = ({ email, otp, new_password }) =>
  api.post(`/reset-password`, {
    email,
    otp,
    new_password,
  });

export const registerSeller = (data) =>
  api.post(`/register-seller`, data);

export const fetchPendingSellers = () =>
  api.get(`/pending-sellers`);

export const approveSeller = (id) =>
  api.post(`/approve-seller/${id}`);

export const rejectSeller = (id) =>
  api.delete(`/reject-seller/${id}`);

export const fetchSellers = () =>
  api.get(`/sellers`);

export const fetchSellerProducts = (sellerId) =>
  api.get(`/api/seller-products/${sellerId}`);

export const fetchSellerOrders = (sellerId) =>
  api.get(`/api/seller-orders/${sellerId}`);



