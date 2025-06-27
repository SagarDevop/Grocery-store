import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import products from "../Data/allproducts.js"; 
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useCart } from "../Components/CartContext";


export default function ProductDetail() {
  const { addToCart } = useCart();
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const foundProduct = products.find((item) => item.id.toString() === id);
    setProduct(foundProduct);
  }, [id]);

  if (!product) return <p>Loading or Product Not Found...</p>;

  return (
  <div className="p-6 max-w-6xl mx-auto bg-white shadow-xl rounded-xl mt-6">
  {/* Main Layout */}
  <div className="flex flex-col md:flex-row gap-8">
    {/* Image Section */}
    <div className="flex flex-col gap-4 md:w-1/2">
      <div className="rounded-lg overflow-hidden shadow-sm">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={10}
          navigation
          pagination={{ clickable: true }}
          className="w-full"
          style={{ height: "320px" }}
        >
          {(product.images || [product.image]).map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`Slide ${index}`}
                className="w-full h-80 object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Add to Cart below image */}
      <button
      onClick={() => addToCart(product)}
      className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-3 rounded-lg shadow w-full">
        🛒 Add to Cart
      </button>
    </div>

    {/* Right Detail Section */}
    <div className="flex flex-col justify-start gap-4 md:w-1/2">
      {/* Title & Category */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-sm text-gray-500">{product.category}</p>
      </div>

      {/* Price, Discount, Rating */}
      <div className="space-y-1 border p-4 rounded-lg bg-gray-50">
        <p className="text-2xl font-bold text-green-700">₹{product.price}</p>
        <p className="text-sm text-gray-500 line-through">
          ₹{product.price + 10}
        </p>
        <p className="text-sm text-red-500 font-medium">
          Save ₹{10} ({Math.floor((10 / (product.price + 10)) * 100)}%)
        </p>
        <p className="text-xs text-gray-600">Net Weight: 500g</p>

        {/* Ratings */}
        <div className="flex items-center gap-1 text-yellow-500 text-sm mt-2">
          ★★★★☆ <span className="text-gray-600 ml-1">(234 reviews)</span>
        </div>
      </div>
    </div>
  </div>

  {/* Delivery & Quality Info */}
  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
    <div className="space-y-2">
      <h3 className="text-base font-semibold text-gray-800">🚚 Delivery Info</h3>
      <p>Delivery by tomorrow 9 AM</p>
      <p>Free delivery on orders above ₹199</p>
    </div>
    <div className="space-y-2">
      <h3 className="text-base font-semibold text-gray-800">📦 Packaging & Storage</h3>
      <p>Packaging: Sealed Pouch</p>
      <p>Store in a cool, dry place</p>
      <p>✅ 100% Fresh Guarantee</p>
    </div>
  </div>

  {/* Description */}
  <div className="mt-10 pt-6 border-t">
    <h2 className="text-lg font-semibold mb-2">Product Description</h2>
    <p className="text-gray-700 text-sm leading-relaxed">
      {product.fullDescription || "No description available."}
    </p>
  </div>
</div>


  );
}
