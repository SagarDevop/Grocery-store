import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import authReducer from './authSlice'
import wishlistReducer from './wishlistSlice'
import { cartSyncMiddleware } from "./cartSyncMiddleware";

export default configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartSyncMiddleware),
})