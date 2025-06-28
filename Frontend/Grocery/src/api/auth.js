// src/api/auth.js
import axios from "axios";

const BASE_URL = "https://grocery-store-ue2n.onrender.com"; 

export const signup = (data) => axios.post(`${BASE_URL}/signup`, data);

export const login = (data) => axios.post(`${BASE_URL}/login`, data);

export const verifyOTP = (data) => axios.post(`${BASE_URL}/verify-otp`, data);

export const forgotPassword = (email) =>
  axios.post(`${BASE_URL}/forgot-password`, { email });

export const resetPassword = ({ email, otp, new_password }) =>
  axios.post(`${BASE_URL}/reset-password`, {
    email,
    otp,
    new_password,
  });

export const registerSeller = (data) =>
  axios.post(`${BASE_URL}/register-seller`, data);

// Fetch all pending sellers
export const fetchPendingSellers = () =>
  axios.get(`${BASE_URL}/pending-sellers`);

// Approve a pending seller
export const approveSeller = (id) =>
  axios.post(`${BASE_URL}/approve-seller/${id}`);

// Reject a pending seller
export const rejectSeller = (id) =>
  axios.delete(`${BASE_URL}/reject-seller/${id}`);



