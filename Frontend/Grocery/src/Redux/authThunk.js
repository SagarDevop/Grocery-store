import api from "../api/apiConfig";

// Refresh user profile based on email
export const refreshUserProfile = (email) => async (dispatch) => {
  try {
    const res = await api.get(`/api/profile/${email}`);

    const updatedUser = res.data;

    // Update localStorage and Redux state
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'auth/loginUser', payload: updatedUser });
  } catch (error) {
    console.error("Failed to refresh user profile:", error);
  }
};
