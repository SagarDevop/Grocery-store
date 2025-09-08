import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


// Sample Data
const categories = [
  { name: "Vegetables", image: "/Organic veggies.png", bg: "bg-yellow-100" },
  { name: "Fresh Fruits", image: "/Fresh Fruits.png", bg: "bg-pink-100" },
  { name: "Instant Food", image: "/Instant Food.png", bg: "bg-blue-100" },
  { name: "Dairy Products", image: "/Dairy Products.png", bg: "bg-orange-100" },
  { name: "Bakery & Breads", image: "/Bakery & Breads.png", bg: "bg-sky-100" },
  { name: "Grains & Cereals", image: "/Grains & Cereals.png", bg: "bg-purple-100" },
  { name: "Daily Essentials", image: "/Daily.png", bg: "bg-yellow-100" },
  { name: "Personal Care", image: "/Personal Care.png", bg: "bg-pink-100" },
];

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const CategoriesAndBestSellers = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    const encodedName = encodeURIComponent(categoryName);
    navigate(`/category/${encodedName}`);
  };

  return (
    <div className="px-[6vw] py-10">
      {/* Categories */}
      <h2 className="text-2xl font-semibold mb-6 text-green-800">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className={`group rounded-xl p-4 flex flex-col items-center text-center shadow-md cursor-pointer hover:shadow-lg transition duration-300 ${cat.bg}`}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleCategoryClick(cat.name)}
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-16 h-16 object-contain mb-2 transition-transform duration-300 group-hover:scale-110"
            />
            <p className="text-sm font-medium group-hover:text-gray-700 transition-colors duration-300">
              {cat.name}
            </p>
          </motion.div>
        ))}
      </div>      
    </div>
  );
};


export default CategoriesAndBestSellers;
