import React from "react";
import { ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../Redux/cartSlice";
import { useSelector } from "react-redux";
import { Error, Success } from "../Utils/toastUtils";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  const showcard = () => {
    const productId =
      typeof product._id === "object" && product._id.$oid
        ? product._id.$oid
        : product._id || product.id;

    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevents the parent click

    if (!user) {
      Error("Please login to add items to cart");
      return;
    }

    dispatch(addToCart(product));

    
    Success("Added to cart");
  };

  return (
    <div
      className="border rounded-xl p-4 shadow-md hover:scale-105 transition cursor-pointer group"
      onClick={showcard}
    >
      <img
        src={
          product.images && product.images.length > 0
            ? product.images[0]
            : product.image
        }
        alt={product.name}
        className="w-full h-32 object-cover rounded"
      />
      <h2 className="mt-2 font-semibold">{product.name}</h2>
      <p className="text-sm text-gray-600">₹{product.price}</p>
      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-1 inline-block">
        {product.category}
      </span>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="mt-3 flex items-center gap-2 text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
      >
        <ShoppingCart size={16} /> Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
