import {
  Eye,
  Wallet,
  Truck,
  Clock3,
  Headphones,
} from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: <Eye className="w-8 h-8 text-green-600" />,
    title: "High Visibility",
    desc: "Get your products in front of thousands of local buyers every day.",
  },
  {
    icon: <Wallet className="w-8 h-8 text-green-600" />,
    title: "Zero Setup Fees",
    desc: "Join and list your items without any upfront charges.",
  },
  {
    icon: <Truck className="w-8 h-8 text-green-600" />,
    title: "Delivery Support",
    desc: "We take care of delivery so you can focus on your products.",
  },
  {
    icon: <Clock3 className="w-8 h-8 text-green-600" />,
    title: "Fast Payouts",
    desc: "Receive payments on a weekly basis directly in your account.",
  },
  {
    icon: <Headphones className="w-8 h-8 text-green-600" />,
    title: "24/7 Seller Support",
    desc: "Our team is always available to help with any issue.",
  },
];

export default function SellerBenefits() {
  return (
    <section className="bg-white py-16 px-4 md:px-12">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
        >
          Why Sell With <span className="text-green-600">GrocoMart?</span>
        </motion.h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-10">
          We provide the tools, audience, and support to help your business grow.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          {benefits.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-green-50 border border-green-100 rounded-xl p-6 shadow hover:shadow-md transition text-left"
            >
              {item.icon}
              <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
