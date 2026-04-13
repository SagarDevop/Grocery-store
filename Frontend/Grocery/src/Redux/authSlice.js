import { createSlice } from '@reduxjs/toolkit';

// Get user data from localStorage initially
const storedUser = localStorage.getItem('user');
const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    setUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
  },
});

export const { loginUser, logoutUser, setUser } = authSlice.actions;
export default authSlice.reducer;
