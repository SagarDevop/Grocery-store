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
    // We send specifically formatted items to ensure MongoDB IDs are clean
    const cartItems = cart.map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.images?.[0] || item.image
    }));

    await api.post("/api/cart/update", {
      email: userEmail,
      cart: cartItems
    });
  } catch (error) {
    console.error("Failed to sync cart:", error);
  }
};
