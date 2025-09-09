import React from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import ProductList from './Components/ProductList'
import Home from './Components/Home'
import ContactUs from './Components/ContactUs' 
import { Toaster } from "react-hot-toast"; 
import CategoryPage from "./Components/CategoryPage";
import Cart from "./Components/Cart";
import BecomeSeller from './Seller/BecomeSeller'
import ProductDetail from './Components/ProductDetail'
import AuthForm from './Components/AuthForm'
import AdminDashboard from './Components/AdminDashboard'
import SellerDashboard from './Seller/SellerDashboard'
import SellerProduct from './Seller/SellerProduct'
import SellerOrder from './Seller/SellerOrder'
import SellerEarning from './Seller/SellerEarning'
import SellerProfile from './Seller/SellerProfile'
import AddProductForm from './Seller/AddProductForm'
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "./Redux/cartThunks";
import { clearCart } from "./Redux/cartSlice";



import { Routes, Route } from 'react-router-dom';

function App() {
   const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart(user.email));  // Load cart from backend on login or refresh
    } else {
      dispatch(clearCart());  // Clear cart when logged out
    }
  }, [user, dispatch]);
 

  return (
    <>
      <Toaster position="top-centre" reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/search" element={<ProductList />} />
        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="/contact" element={<ContactUs/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/seller' element={<BecomeSeller/>} />
        <Route path="/seller-dashboard" element={<SellerDashboard />}>
         <Route path="sellerproductlist" element={<SellerProduct />} />
        <Route path="add-product" element={<AddProductForm />} />
        <Route path="orders" element={<SellerOrder />} />
        <Route path="profile" element={<SellerProfile />} />
        <Route path="earnings" element={<SellerEarning />} />

        </Route>
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/auth" element={<AuthForm />} />
      </Routes>
     
    </>
  )
}

export default App
