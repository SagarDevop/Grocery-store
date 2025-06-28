// pages/SellerDashboard.jsx
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext";

const SellerDashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user || user.role !== "seller") {
    navigate("/");
    return null;
  }

  const isDashboardHome = location.pathname === "/seller-dashboard";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-green-100 p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-6">Seller Panel</h2>
        <ul className="space-y-4">
          <li><button onClick={() => navigate("/seller-dashboard/sellerproductlist")} className="hover:underline">📦 My Products</button></li>
          <li><button onClick={() => navigate("/seller-dashboard/add-product")} className="hover:underline">➕ Add Product</button></li>
          <li><button onClick={() => navigate("/seller-dashboard/orders")} className="hover:underline">🧾 Orders</button></li>
          <li><button onClick={() => navigate("/seller-dashboard/earnings")} className="hover:underline">📊 Earnings</button></li>
          <li><button onClick={() => navigate("/seller-dashboard/profile")} className="hover:underline">👤 Profile</button></li>
          <li><button onClick={logoutUser} className="text-red-500 hover:underline">🚪 Logout</button></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white">
        {isDashboardHome ? (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold mb-4">Welcome, {user.name} 👋</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-green-50 p-4 rounded-lg shadow">
                <p className="text-gray-500">Total Products</p>
                <p className="text-2xl font-semibold">12</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg shadow">
                <p className="text-gray-500">Orders</p>
                <p className="text-2xl font-semibold">34</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg shadow">
                <p className="text-gray-500">Earnings</p>
                <p className="text-2xl font-semibold">₹5,800</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg shadow">
                <p className="text-gray-500">Pending Orders</p>
                <p className="text-2xl font-semibold">3</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">📢 Notifications</h2>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Check your inventory, 2 products are out of stock</li>
                <li>New order received from user123</li>
              </ul>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default SellerDashboard;
