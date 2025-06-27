import React, { useState } from "react";
import {
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { Success, Error } from "../Utils/toastUtils.js";

export default function ContactUs() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    console.log("Submitting:", { name, email, message });

    setTimeout(() => {
      const isSuccess = Math.random() > 0.3;
      setLoading(false);

      if (isSuccess) {
        Success("Your message has been sent successfully!");
        e.target.reset();
      } else {
        Error("Failed to send message. Please try again.");
      }
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-white">
      {/* Hero Banner */}
      <div
        className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center text-white text-center"
        style={{
          backgroundImage:
            "url('https://c8.alamy.com/comp/2BXK8YJ/vector-cartoon-stick-figure-drawing-conceptual-illustration-of-local-farmer-selling-food-fruit-and-vegetable-on-market-2BXK8YJ.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Contact Us</h1>
          <p className="text-lg">
            We're here to help you with anything you need.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Contact Info */}
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-start gap-4">
              <Mail className="text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="text-gray-600">support@grocershop.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MessageCircle className="text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold">WhatsApp</h4>
                {/* Floating WhatsApp Button */}
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 transition-transform hover:scale-110"
                  aria-label="Chat on WhatsApp"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    className="lucide lucide-message-circle"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold">Address</h4>
                <p className="text-gray-600">
                  123 Grocery Lane, Fresh Market, Delhi
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold">Business Hours</h4>
                <p className="text-gray-600">Mon - Sun: 9:00 AM - 9:00 PM</p>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Facebook className="text-blue-600 hover:scale-110 transition" />
              <Instagram className="text-pink-500 hover:scale-110 transition" />
              <Twitter className="text-sky-500 hover:scale-110 transition" />
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow-xl space-y-5 animate-fade-in-up"
          >
            <div>
              <label className="block mb-1 text-sm font-medium">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Message</label>
              <textarea
                name="message"
                rows="4"
                placeholder="Your message here..."
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 justify-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-pulse">Sending...</span>
              ) : (
                <>
                  <Send size={18} /> Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Map Embed */}
        <div className="mt-16 animate-fade-in">
          <h3 className="text-xl font-semibold mb-2 text-green-700">
            📍 Find Us Here
          </h3>
          <iframe
            className="rounded-xl w-full h-64 border"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d561.8399831624046!2d80.3460619!3d25.4934011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1718806200000"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
