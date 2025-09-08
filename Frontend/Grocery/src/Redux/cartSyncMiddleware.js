import { syncCart } from "./cartThunks";

export const cartSyncMiddleware = (store) => (next) => (action) => {
  const result = next(action); // Let the action update the state first

  const cartActions = ["cart/addToCart", "cart/removeFromCart", "cart/increaseQty", "cart/decreaseQty", "cart/clearCart"];

  if (cartActions.includes(action.type)) {
    const state = store.getState();
    const user = state.auth.user;
    const cart = state.cart.items;

    if (user) {
      store.dispatch(syncCart(user.email, cart));
    }
  }

  return result;
};
