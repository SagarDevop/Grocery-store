import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../Components/CartContext";
import { useAuth } from "../Components/AuthContext";
import { Error } from "../Utils/toastUtils";

export default function Cart() {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const { user } = useAuth(); // ✅ Correct place to call useAuth()

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
                key={item.id}
                className="flex items-center justify-between bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-600">₹{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="bg-gray-200 p-1 rounded"
                      >
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQty(item.id)}
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
                    onClick={() => removeFromCart(item.id)}
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
                // ✅ Add your navigation or checkout logic here
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
