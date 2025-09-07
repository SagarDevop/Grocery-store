import axios from "axios";
import { setCart } from "./cartSlice";

export const fetchCart = (userEmail) => async (dispatch) => {
  try {
    const res = await axios.get(`https://grocery-store-ue2n.onrender.com/api/cart/${userEmail}`);
    dispatch(setCart(res.data.cart || []));
  } catch (error) {
    console.error("Failed to fetch cart:", error);
  }
};

export const syncCart = (userEmail, cart) => async () => {
  try {
    await axios.post("https://grocery-store-ue2n.onrender.com/api/cart/update", {
      email: userEmail,
      cart: cart
    });
  } catch (error) {
    console.error("Failed to sync cart:", error);
  }
};
