import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from 'react-router-dom';

// Lazy load components for performance
const Home = lazy(() => import('./Components/Home'));
const ProductList = lazy(() => import('./Components/ProductList'));
const ContactUs = lazy(() => import('./Components/ContactUs'));
const CategoryPage = lazy(() => import("./Components/CategoryPage"));
const Cart = lazy(() => import("./Components/Cart"));
const CheckoutPage = lazy(() => import("./Components/CheckoutPage"));
const BecomeSeller = lazy(() => import('./Seller/BecomeSeller'));
const ProductDetail = lazy(() => import('./Components/ProductDetail'));
const AuthForm = lazy(() => import('./Components/AuthForm'));
const AdminDashboard = lazy(() => import('./Components/AdminDashboard'));
const SellerDashboard = lazy(() => import('./Seller/SellerDashboard'));
const ProductCard = lazy(() => import('./Components/ProductCard'));
const UserProfile = lazy(() => import('./Components/Profile/UserProfile'));

// Seller Sub-components
const SellerProduct = lazy(() => import('./Seller/SellerProduct'));
const SellerOrder = lazy(() => import('./Seller/SellerOrder'));
const SellerEarning = lazy(() => import('./Seller/SellerEarning'));
const SellerProfile = lazy(() => import('./Seller/SellerProfile'));
const AddProductForm = lazy(() => import('./Seller/AddProductForm'));

// Static Components
import Navbar from './Components/Navbar';
import { Toaster } from "react-hot-toast"; 
import { fetchCart, syncCart } from "./Redux/cartThunks";
import { clearCart } from "./Redux/cartSlice";
import { fetchWishlist, clearWishlist } from "./Redux/wishlistSlice";
import { refreshUserProfile } from "./Redux/authThunk";
import ProtectedRoute from "./Components/ProtectedRoute"; // Import ProtectedRoute

// Modern Loading Spinner for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);

  // Initial Load & Auth Sync
  useEffect(() => {
    if (user?._id) {
      console.log("Persistence Sync: Refreshing profile for:", user.email);
      dispatch(refreshUserProfile(user.email));
      dispatch(fetchCart(user.email));  
      dispatch(fetchWishlist()); 
    } else if (!user) {
      dispatch(clearCart());
      dispatch(clearWishlist());
    }
  }, [user?._id, dispatch]);

  // Sync Cart to DB on changes
  useEffect(() => {
    if (user?._id && cartItems.length >= 0) {
      const timeoutId = setTimeout(() => {
        dispatch(syncCart(user.email, cartItems));
      }, 1000); // Debounce sync
      return () => clearTimeout(timeoutId);
    }
  }, [cartItems, user?._id, dispatch]);

  return (
    <>
      <Toaster position="top-centre" reverseOrder={false} />
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }>
             <Route path="sellers" element={<AdminDashboard />} />
             <Route path="products" element={<AdminDashboard />} />
             <Route path="users" element={<AdminDashboard />} />
             <Route path="orders" element={<AdminDashboard />} />
             <Route path="settings" element={<AdminDashboard />} />
          </Route>

          <Route path="/products" element={<ProductList />} />
          <Route path="/search" element={<ProductList />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/contact" element={<ContactUs/>} />
          
          <Route path='/cart' element={
            <ProtectedRoute>
              <Cart/>
            </ProtectedRoute>
          } />
          
          <Route path='/checkout' element={
            <ProtectedRoute>
              <CheckoutPage/>
            </ProtectedRoute>
          } />

          <Route path='/seller' element={<BecomeSeller/>} />
          
          <Route path="/seller-dashboard" element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerDashboard />
            </ProtectedRoute>
          }>
            <Route path="sellerproductlist" element={<SellerProduct />} />
            <Route path="add-product" element={<AddProductForm />} />
            <Route path="orders" element={<SellerOrder />} />
            <Route path="profile" element={<SellerProfile />} />
            <Route path="earnings" element={<SellerEarning />} />
          </Route>

          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/auth" element={<AuthForm />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
