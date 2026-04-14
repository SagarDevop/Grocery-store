import api from "../api/apiConfig";
import { loginUser, logoutUser } from "./authSlice";

// Refresh user profile based on email
export const refreshUserProfile = (email) => async (dispatch) => {
  const url = `/api/profile/${email}`;
  console.log("Refreshing profile from:", url);
  try {
    const res = await api.get(url);

    const updatedUser = res.data;
    const token = localStorage.getItem('token');

    // Update state using the existing loginUser action
    dispatch(loginUser({ user: updatedUser, token }));
  } catch (error) {
    console.error("Failed to refresh user profile:", error);
    // If user no longer exists (404) or token is bad (401), force logout to break the loop
    if (error.response?.status === 404 || error.response?.status === 401) {
      console.warn("Session invalid - clearing stale data.");
      dispatch(logoutUser());
    }
  }
};
