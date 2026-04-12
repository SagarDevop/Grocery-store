import { setCart } from "./cartSlice";
import api from "../api/apiConfig";

export const fetchCart = (userEmail) => async (dispatch) => {
  try {
    const res = await api.get(`/api/cart/${userEmail}`);
    dispatch(setCart(res.data.cart || []));
  } catch (error) {
    console.error("Failed to fetch cart:", error);
  }
};

export const syncCart = (userEmail, cart) => async () => {
  try {
    await api.post("/api/cart/update", {
      email: userEmail,
      cart: cart
    });
  } catch (error) {
    console.error("Failed to sync cart:", error);
  }
};
