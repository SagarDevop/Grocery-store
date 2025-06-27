import { UserPlus, Upload, ShoppingCart, Banknote } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <UserPlus className="w-8 h-8 text-green-600" />,
    title: "Sign Up",
    desc: "Create your seller profile in minutes.",
  },
  {
    icon: <Upload className="w-8 h-8 text-green-600" />,
    title: "List Products",
    desc: "Add your items with pricing and stock info.",
  },
  {
    icon: <ShoppingCart className="w-8 h-8 text-green-600" />,
    title: "Get Orders",
    desc: "Start receiving orders from local buyers.",
  },
  {
    icon: <Banknote className="w-8 h-8 text-green-600" />,
    title: "Get Paid",
    desc: "Receive weekly payments to your account.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-green-50 py-16 px-4 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
        >
          How It Works
        </motion.h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-12">
          Start your selling journey in just a few simple steps.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-xl p-6 shadow-md text-center"
            >
              <div className="mb-4 flex justify-center">{step.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
