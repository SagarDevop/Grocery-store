// src/pages/AdminDashboard.jsx
import { useAuth } from "../Components/AuthContext";
import PendingSellers from "../Seller/PendingSellers.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.is_admin) {
      navigate("/"); // Redirect if not admin
    }
  }, [user, navigate]);

  if (!user || !user.is_admin) {
    return null; // or show "Loading..."
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">👑 Admin Dashboard</h1>

      <section className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">
          Pending Seller Requests
        </h2>
        <PendingSellers />
      </section>
    </div>
  );
}
