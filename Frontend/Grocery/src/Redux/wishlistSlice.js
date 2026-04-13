import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWishlist, toggleWishlist as toggleWishlistAPI } from '../api/auth';
import { toast } from 'react-hot-toast';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getWishlist();
      return response.data.products; // Returns array of product objects or IDs
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await toggleWishlistAPI(productId);
      return { productId, wishlist: response.data.wishlist.products };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.items = action.payload.wishlist;
        // The controller returns the full list of IDs/Products
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
