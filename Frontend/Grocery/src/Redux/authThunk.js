import axios from "axios";

// Refresh user profile based on email
export const refreshUserProfile = (email) => async (dispatch) => {
  try {
    const res = await axios.get(
      `https://grocery-store-ue2n.onrender.com/api/profile/${email}`
    );

    const updatedUser = res.data;

    // Update localStorage and Redux state
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'auth/loginUser', payload: updatedUser });
  } catch (error) {
    console.error("Failed to refresh user profile:", error);
  }
};
