import { motion } from "framer-motion";
import { useCart } from "../Components/CartContext";



const bestSellers = [
  { id: "p1", name: "Potato 500g",category: "Organic veggies", price: 35, image: "https://images.unsplash.com/photo-1603048719539-9ecb4aa395e3?q=80&w=884&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "p2", name: "Tomato 1kg",category: "Organic veggies", price: 28, image: "https://plus.unsplash.com/premium_photo-1661811820259-2575b82101bf?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "p3", name: "Carrot 500g",category: "Organic veggies", price: 44, image: "https://images.unsplash.com/photo-1582515073490-39981397c445?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "p4", name: "Spinach 500g",category: "Organic veggies", price: 15, image: "https://images.unsplash.com/photo-1683355739329-cea18ba93f02?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: "p5", name: "Onion 500g",category: "Organic veggies", price: 45, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BpbmFjaHxlbnwwfHwwfHx8MA%3D%3D" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function BestSeller() {
  
  const { addToCart } = useCart();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
      {bestSellers.map((item, index) => (
        <motion.div
          key={index}
          className="relative border p-4 rounded-lg text-center shadow-lg overflow-hidden h-64 cursor-pointer group"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={index}
          variants={fadeUp}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {/* Background Image */}
          <motion.img
            src={item.image}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 transition duration-300 group-hover:bg-black/40"></div>

          {/* Content */}
          <div className="relative pt-[20vh] z-10 text-white flex flex-col items-center justify-center h-full">
            <p className="font-semibold text-lg drop-shadow-sm">{item.name}</p>
            <p className="text-green-300 font-bold drop-shadow">₹{item.price}</p>
            <motion.button
              
              whileTap={{ scale: 0.95 }}
              className="mt-2 px-4 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
            >
              Add
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
