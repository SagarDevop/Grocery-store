import { createContext, useContext, useState, useEffect } from "react";
import { Success, Error } from "../Utils/toastUtils.js";
import { useAuth } from "./AuthContext";
import axios from "axios";


const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

   useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/api/cart/${user.email}`)
        .then((res) => setCart(res.data.cart || []))
        .catch((err) => console.error("Failed to fetch cart:", err));
    } else {
      setCart([]); // clear cart on logout
    }
  }, [user]);

  const syncCart = (updatedCart) => {
    if (!user) return;
    axios.post("http://localhost:5000/api/cart/update", {
      email: user.email,
      cart: updatedCart,
    });
  };

  const addToCart = (product) => {
    if (!user) {
      Error("Please login to add items to cart");
      return;
    }

    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      let updatedCart;
      if (exists) {
        updatedCart = prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prev, { ...product, quantity: 1 }];
        Success("Added to cart");
      }

      syncCart(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    syncCart(updatedCart);
  };

  const increaseQty = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    syncCart(updatedCart);
  };

  const decreaseQty = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    setCart(updatedCart);
    syncCart(updatedCart);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, increaseQty, decreaseQty }}
    >
      {children}
    </CartContext.Provider>
  );
};