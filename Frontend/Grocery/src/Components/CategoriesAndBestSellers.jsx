import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://grocery-store-ue2n.onrender.com/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("❌ Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="px-[6vw] py-10">
      <h2 className="text-2xl font-bold text-green-800 mb-6">🗂️ Browse Categories</h2>

      {loading ? (
        <p>Loading...</p>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <Link
              to={`/category/${encodeURIComponent(cat)}`}
              key={index}
              className="border rounded-lg p-4 shadow hover:bg-green-50 text-center text-lg text-gray-700 font-medium"
            >
              {cat}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No categories found.</p>
      )}
    </div>
  );
};

export default CategoryList;
