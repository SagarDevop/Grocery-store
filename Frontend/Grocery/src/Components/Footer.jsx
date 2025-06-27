import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-green-100 text-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo & Tagline */}
        <div>
          <h2 className="text-2xl font-bold text-green-600">🥦 FreshGrocer</h2>
          <p className="mt-2 text-sm">
            Delivering freshness to your doorstep — always organic, always on time.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:text-green-600">Home</a></li>
            <li><a href="#" className="hover:text-green-600">Shop</a></li>
            <li><a href="#" className="hover:text-green-600">About</a></li>
            <li><a href="#" className="hover:text-green-600">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Contact</h3>
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2"><MapPin size={16} /> Chitrakoot, India</li>
            <li className="flex items-center gap-2"><Phone size={16} /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail size={16} /> support@freshgrocer.com</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Follow Us</h3>
          <div className="flex gap-4 mt-2">
            <a  target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/"><Facebook className="hover:text-green-600" /></a>
            <a target="_blank" rel="noopener noreferrer" href="#"><Instagram className="hover:text-green-600" /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 text-center py-4 text-sm text-gray-600">
        © {new Date().getFullYear()} FreshGrocer. All rights reserved.
      </div>
    </footer>
  );
}
