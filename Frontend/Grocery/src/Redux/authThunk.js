import api from "../api/apiConfig";
import { loginUser, logoutUser } from "./authSlice";

// Refresh user profile based on current session (token)
export const refreshUserProfile = () => async (dispatch) => {
  const url = `/api/user/profile`;
  console.log("Refreshing session from:", url);
  try {
    const res = await api.get(url);

    const updatedUser = res.data;
    const token = localStorage.getItem('token');

    // Update state using the existing loginUser action
    dispatch(loginUser({ user: updatedUser, token }));
  } catch (error) {
    console.error("Failed to refresh user profile:", error);
    // If it's a 401 or 404, the session is definitively dead.
    // The interceptor will broadcast 'session-expired', but we catch it here for immediate cleanup.
    if (error.response?.status === 401 || error.response?.status === 404) {
      dispatch(logoutUser());
    }
  }
};
