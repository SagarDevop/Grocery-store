import { Store, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

export default function BecomeSellerHero({ onRegisterClick }) {
  return (
    <section className="bg-gradient-to-r from-green-100 via-yellow-50 to-white py-16 px-4 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 flex items-center gap-3">
            <Store className="w-10 h-10 text-green-600" />
            Become a Seller on <span className="text-green-700">GrocoMart</span>
          </h1>
          <p className="text-lg text-gray-600">
            Grow your local business by listing your products on our platform. Reach thousands of customers without any upfront cost.
          </p>
          <button
          onClick={onRegisterClick}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow transition">
            Register Now
          </button>

          {/* Small badges or highlights */}
          <div className="flex items-center gap-4 mt-4">
            <div className="bg-white px-4 py-2 shadow rounded-full flex items-center gap-2 text-sm text-gray-700">
              <IndianRupee className="w-4 h-4 text-green-600" />
              No Commission 1st Month
            </div>
            <div className="bg-white px-4 py-2 shadow rounded-full text-sm text-gray-700">
              100+ Active Sellers
            </div>
          </div>
        </motion.div>

        {/* Right Image or Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1"
        >
          <img
            src="https://img.freepik.com/free-vector/street-seller-illustration_1284-11371.jpg"
            alt="Become a Seller"
            className="w-full max-w-md mx-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}
