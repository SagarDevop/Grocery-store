import React from "react";
import { useParams } from "react-router-dom";
import allProducts from "../Data/allproducts.js"; 
import ProductCard from "./ProductCard"; 

const CategoryPage = () => {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);

  const filteredProducts = allProducts.filter((product) =>
    product.category.toLowerCase() === decodedName.toLowerCase()
  );

  return (
    <div className="px-[6vw] py-10">
      <h2 className="text-2xl font-semibold mb-6 text-green-800">
        Showing results for: <span className="text-gray-700">{decodedName}</span>
      </h2>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found in this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;
