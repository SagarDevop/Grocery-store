import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";

const CategoryPage = () => {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchByCategory = async () => {
      try {
        const res = await axios.get(`https://grocery-store-ue2n.onrender.com/products/category/${decodedName}`);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error("❌ Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchByCategory();
  }, [decodedName]);

  return (
    <div className="px-[6vw] py-10">
      <h2 className="text-2xl font-semibold mb-6 text-green-800">
        Showing results for: <span className="text-gray-700">{decodedName}</span>
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found in this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;
