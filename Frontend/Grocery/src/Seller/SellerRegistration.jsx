import { useState } from "react";
import { toast } from "react-hot-toast";
import { Store } from "lucide-react";
import confetti from "canvas-confetti";
import { registerSeller } from "../api/auth";

export default function SellerRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    store: "",
    products: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    await registerSeller(formData);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    toast.success("Registration submitted! We'll contact you soon.");
    setFormData({
      name: "",
      phone: "",
      email: "",
      city: "",
      store: "",
      products: "",
    });
  } catch (err) {
    console.error(err);
    toast.error(
      err.response?.data?.message || "Something went wrong. Try again!"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="bg-white py-16 px-4 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <Store className="mx-auto mb-4 text-green-600" size={48} />
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Ready to Start Selling?
        </h2>
        <p className="text-gray-600 mb-10">
          Fill out the form below and our team will contact you within 24 hours.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-green-50 p-8 rounded-2xl shadow-lg max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            pattern="[0-9]{10}"
            title="Enter a valid 10-digit phone number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            name="store"
            placeholder="Store Name"
            value={formData.store}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            name="products"
            placeholder="Products You Sell"
            value={formData.products}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="col-span-1 md:col-span-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Registration"}
          </button>
        </form>
      </div>
    </section>
  );
}
