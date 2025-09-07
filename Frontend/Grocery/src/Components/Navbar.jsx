import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logoutUser as logoutAction } from "../Redux/authSlice"; // Redux logout
import { Dialog } from "@headlessui/react";
import { Success, Error } from "../Utils/toastUtils.js";
import {
  ShoppingCart,
  UserCircle,
  Home,
  ListOrdered,
  Phone,
  Search,
  Menu,
  X,
  Store,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user); // Redux user

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/", icon: <Home size={15} /> },
    { name: "All Product", path: "/products", icon: <ListOrdered size={15} /> },
    { name: "Contact", path: "/contact", icon: <Phone size={15} /> },
    { name: "Be-Seller", path: "/seller", icon: <Store size={15} /> },
  ];

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      const trimmed = searchTerm.trim();
      if (trimmed) {
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
        setSearchTerm("");
      }
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    setIsDialogOpen(false);
    Error("Logged out successfully");
    navigate("/");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full shadow-md sticky top-0 z-50 bg-white px-[8vw] py-4 flex items-center justify-between "
      >
        {/* Logo */}
        <div className="text-2xl font-bold text-green-600 flex items-center gap-2 cursor-pointer">
          <span className="text-3xl">🛒</span> GreenCart
        </div>

        {/* Desktop Links */}
        <div className="flex gap-8">
          <ul className="hidden md:flex items-center gap-5 text-gray-700 font-small text-m">
            {navLinks.map((link, i) => (
              <motion.li key={i} className="relative group">
                <Link
                  to={link.path}
                  className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition duration-300"
                >
                  {link.icon}
                  {link.name}
                </Link>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
              </motion.li>
            ))}
          </ul>

          {/* Search */}
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="hidden lg:flex items-center border rounded-full px-1 shadow-sm bg-gray-50 focus-within:ring-2 ring-green-300"
          >
            <input
              type="text"
              placeholder="Search products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              className="outline-none bg-transparent px-2 py-1 w-64"
            />
            <motion.button
              onClick={handleSearch}
              whileTap={{ scale: 0.9 }}
              className="text-gray-500 hover:text-green-600 transition"
            >
              <Search size={20} />
            </motion.button>
          </motion.div>

          {/* Right Icons */}
          <div className="flex items-center gap-5 text-gray-700">
            {/* Cart */}
            <Link to="/cart" className="relative">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer hover:text-green-600 transition"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-green-500 text-white rounded-full px-1">
                    {totalItems}
                  </span>
                )}
              </motion.div>
            </Link>

            {/* Admin & Seller Links */}
            {user?.is_admin && (
              <Link
                to="/admin-dashboard"
                className="hidden md:inline text-green-600 font-semibold hover:underline"
              >
                Admin Panel
              </Link>
            )}
            {user?.role === "seller" && (
              <Link
                to="/seller-dashboard"
                className="text-green-700 border border-green-600 px-3 py-1 rounded-lg hover:bg-green-600 hover:text-white transition"
              >
                Seller Panel
              </Link>
            )}

            {/* User Icon or Avatar */}
            {user ? (
              <>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer hover:text-green-600 transition"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                    {user.name[0].toUpperCase()}
                  </div>
                </motion.div>

                {/* Dialog Modal */}
                <Dialog
                  open={isDialogOpen}
                  onClose={() => setIsDialogOpen(false)}
                  className="fixed z-50 inset-0 overflow-y-auto"
                >
                  <div className="flex items-center justify-center min-h-screen px-4">
                    <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-xl shadow-2xl relative">
                      <button
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        ✕
                      </button>
                      <Dialog.Title className="text-xl font-bold text-green-600 mb-4">
                        Account Details
                      </Dialog.Title>
                      <div className="space-y-2">
                        <p>
                          <span className="font-medium">Name:</span> {user.name}
                        </p>
                        <p>
                          <span className="font-medium">Email:</span> {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        Logout
                      </button>
                    </Dialog.Panel>
                  </div>
                </Dialog>
              </>
            ) : (
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer hover:text-green-600 transition"
                onClick={() => navigate("/auth")}
              >
                <UserCircle size={25} />
              </motion.div>
            )}

            {/* Mobile Menu */}
            <motion.div
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen(true)}
              className="md:hidden cursor-pointer"
            >
              <Menu size={28} />
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 w-3/4 max-w-xs h-full bg-white shadow-lg z-50 p-6 flex flex-col gap-6"
          >
            <div className="flex justify-end">
              <button onClick={() => setMobileOpen(false)}>
                <X size={28} className="text-gray-700 hover:text-green-600" />
              </button>
            </div>

            <ul className="flex flex-col gap-4 text-gray-700 font-medium">
              {navLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 hover:text-green-600 transition"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </li>
              ))}
              {!user && (
                <li>
                  <button
                    onClick={() => {
                      navigate("/auth");
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <UserCircle size={20} />
                    Login / Signup
                  </button>
                </li>
              )}
              {user && (
                <li>
                  <div className="border-t pt-4 mt-4">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <button
                      onClick={() => {
                        dispatch(logoutAction());
                        setMobileOpen(false);
                        navigate("/");
                      }}
                      className="mt-2 text-red-500 hover:underline text-sm"
                    >
                      Logout
                    </button>
                  </div>
                </li>
              )}
              {user?.is_admin && (
                <Link to="/admin-dashboard" className="text-green-600 font-bold">
                  Admin Panel
                </Link>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
