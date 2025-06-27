// SellerDashboard.jsx
import React from "react";
import { useAuth } from "../Components/AuthContext";
import { useNavigate } from "react-router-dom";

const SellerDashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== "seller") {
    navigate("/");
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name} 🛍️</h1>
      <p className="mb-2">Your email: {user.email}</p>
      <p className="mb-4">Dashboard for managing your products and store.</p>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={logoutUser}
      >
        Logout
      </button>
    </div>
  );
};

export default SellerDashboard;
