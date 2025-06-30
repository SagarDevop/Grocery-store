import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import FilterBar from "./FilterBar";
import SortBar from "./SortBar";
import ProductCard from "./ProductCard.jsx";

const ProductList = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q")?.toLowerCase() || "";

  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    axios.get("https://grocery-store-ue2n.onrender.com/products")
      .then((res) => setAllProducts(res.data))
      .catch((err) => console.error("Error fetching products", err));
  }, []);

  const categories = ["All", ...new Set(allProducts.map((p) => p.category))];

  const filteredAndSorted = useMemo(() => {
    let result = allProducts.filter((product) => {
      const matchesQuery = product.name.toLowerCase().includes(query);
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });

    switch (sortBy) {
      case "priceLowHigh":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceHighLow":
        result.sort((a, b) => b.price - a.price);
        break;
      case "nameAZ":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameZA":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [query, selectedCategory, sortBy, allProducts]);

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {query ? `Search results for: "${query}"` : "All Products"}
      </h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <FilterBar
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <SortBar sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      {filteredAndSorted.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAndSorted.map((prod) => (
            <ProductCard key={prod._id?.$oid || prod._id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
