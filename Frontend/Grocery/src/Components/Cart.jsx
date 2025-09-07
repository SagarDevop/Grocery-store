import React, { useEffect } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Error } from "../Utils/toastUtils";
import { fetchCart, syncCart } from "../Redux/cartThunks";
import { removeFromCart, increaseQty, decreaseQty } from "../Redux/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  // Fetch cart on mount if user is logged in
  useEffect(() => {
    if (user) {
      dispatch(fetchCart(user.email));
    }
  }, [user, dispatch]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleIncreaseQty = (_id) => {
    dispatch(increaseQty(_id));
    dispatch(syncCart(user.email, cart.map(item => item._id === _id ? { ...item, quantity: item.quantity + 1 } : item)));
  };

  const handleDecreaseQty = (_id) => {
    const updatedCart = cart
      .map((item) =>
        item._id === _id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);

    dispatch(decreaseQty(_id));
    dispatch(syncCart(user.email, updatedCart));
  };

  const handleRemoveFromCart = (_id) => {
    const updatedCart = cart.filter((item) => item._id !== _id);
    dispatch(removeFromCart(_id));
    dispatch(syncCart(user.email, updatedCart));
  };

  return (
    <div className="px-[8vw] py-10">
      <h1 className="text-3xl font-bold mb-6 text-green-700">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="flex flex-col gap-6">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.images && item.images.length > 0 ? item.images[0] : item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-600">₹{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleDecreaseQty(item._id)}
                        className="bg-gray-200 p-1 rounded"
                      >
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleIncreaseQty(item._id)}
                        className="bg-gray-200 p-1 rounded"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className="font-medium">₹{item.price * item.quantity}</p>
                  <button
                    onClick={() => handleRemoveFromCart(item._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t pt-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">
              Total: ₹{total}
            </h2>
            <button
              onClick={() => {
                if (!user) {
                  Error("Please login to proceed");
                  return;
                }
                console.log("Proceeding to checkout");
              }}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
