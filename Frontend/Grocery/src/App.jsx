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
import AddProductForm from './Seller/AddProductForm'


import { Routes, Route } from 'react-router-dom';

function App() {
 

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
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/seller-dashboard/add-product" element={<AddProductForm />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/auth" element={<AuthForm />} />
      </Routes>
     
    </>
  )
}

export default App
