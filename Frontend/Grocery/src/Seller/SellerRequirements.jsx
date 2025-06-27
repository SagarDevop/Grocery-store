import { IdCard, Banknote, Phone, ListOrdered, ImagePlus } from "lucide-react";
import { motion } from "framer-motion";

const requirements = [
  {
    icon: <IdCard className="w-7 h-7 text-green-600" />,
    title: "Aadhar or PAN",
    desc: "Valid government ID for verification.",
  },
  {
    icon: <Banknote className="w-7 h-7 text-green-600" />,
    title: "Bank Account",
    desc: "With IFSC for weekly payouts.",
  },
  {
    icon: <Phone className="w-7 h-7 text-green-600" />,
    title: "Mobile & Email",
    desc: "For contact and order updates.",
  },
  {
    icon: <ListOrdered className="w-7 h-7 text-green-600" />,
    title: "Product Info",
    desc: "List of items with price and stock.",
  },
  {
    icon: <ImagePlus className="w-7 h-7 text-green-600" />,
    title: "Product Images",
    desc: "Optional but helps attract buyers.",
  },
];

export default function SellerRequirements() {
  return (
    <section className="bg-white py-16 px-4 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
        >
          What You Need to Start Selling
        </motion.h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-12">
          Just a few simple things to begin your journey as a seller on GrocoMart.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-left">
          {requirements.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-green-50 p-6 rounded-xl shadow"
            >
              <div className="mb-3">{item.icon}</div>
              <h4 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
