import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { logoutUser as logoutAction } from "../Redux/authSlice";
import { refreshUserProfile } from "../Redux/authThunk";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Success, Error } from "../Utils/toastUtils.js";
import { useTheme } from "../context/ThemeContext";
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
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  User,
  LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import { cn } from "../Utils/cn";

export default function Navbar() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Shop", path: "/products", icon: <ListOrdered size={18} /> },
    { name: "Contact", path: "/contact", icon: <Phone size={18} /> },
    { name: "Sell", path: "/seller", icon: <Store size={18} /> },
  ];

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (user?.email) {
      dispatch(refreshUserProfile(user.email));
    }
  }, [dispatch, user?.email]);

  const handleSearch = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      const trimmed = searchTerm.trim();
      if (trimmed) {
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
        setSearchTerm("");
        setMobileOpen(false);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    setUserMenuOpen(false);
    Error("Logged out successfully");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 w-full transition-all duration-300 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-emerald-500 bg-clip-text text-transparent">
                GreenCart
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "relative py-2 text-sm font-semibold transition-colors duration-300",
                    isActive(link.path) 
                      ? "text-brand-600 dark:text-brand-400" 
                      : "text-slate-600 dark:text-slate-400 hover:text-brand-500"
                  )}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* SearchBar - Desktop */}
              <div className="hidden lg:flex items-center relative group">
                <input
                  type="text"
                  placeholder="Search groceries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-48 xl:w-64 h-10 pl-10 pr-4 rounded-full bg-slate-100 dark:bg-slate-800 border-none text-sm focus:ring-2 ring-brand-500 transition-all duration-300"
                />
                <Search className="absolute left-3 text-slate-400 group-focus-within:text-brand-500" size={18} />
              </div>

              {/* Theme Toggle - Always visible */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="text-slate-600 dark:text-slate-400"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </Button>

              {/* Desktop Only Actions */}
              <div className="hidden md:flex items-center gap-3">
                {/* Cart */}
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="relative text-slate-600 dark:text-slate-400">
                    <ShoppingCart size={22} />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-in fade-in zoom-in">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                </Link>

                {/* User Menu */}
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300"
                    >
                      <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/20">
                        {user.name[0].toUpperCase()}
                      </div>
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setUserMenuOpen(false)} 
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 mt-3 w-56 rounded-2xl bg-white dark:bg-surface-dark-gray shadow-2xl ring-1 ring-black/5 z-50 overflow-hidden"
                          >
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                              <p className="text-sm font-bold truncate">{user.name}</p>
                              <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            </div>
                            <div className="p-2">
                              <Link to="/profile">
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                  <User size={18} className="text-slate-400" />
                                  My Profile
                                </button>
                              </Link>
                              {user?.is_admin && (
                                <Link to="/admin-dashboard">
                                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-emerald-600">
                                    <LayoutDashboard size={18} />
                                    Admin Dashboard
                                  </button>
                                </Link>
                              )}
                              {user?.role === "seller" && (
                                <Link to="/seller-dashboard">
                                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-brand-600">
                                    <Store size={18} />
                                    Seller Dashboard
                                  </button>
                                </Link>
                              )}
                              <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"
                              >
                                <LogOut size={18} />
                                Log Out
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Button variant="primary" size="sm" onClick={() => navigate("/auth")}>
                    Sign In
                  </Button>
                )}
              </div>

              {/* Mobile Search Trigger */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileOpen(true)}
                className="md:hidden text-slate-600 dark:text-slate-400"
              >
                <Search size={22} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-80 bg-white dark:bg-surface-dark shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold text-brand-600">GreenCart</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                  <X size={24} />
                </Button>
              </div>

              {/* Search in Mobile */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none font-medium text-sm focus:ring-2 ring-brand-500"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              </div>

              <div className="space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-bold",
                      isActive(link.path)
                        ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </div>

              {!user && (
                <div className="mt-8">
                  <Button 
                    variant="primary" 
                    className="w-full h-14 rounded-2xl" 
                    onClick={() => {
                      navigate("/auth");
                      setMobileOpen(false);
                    }}
                  >
                    Sign In to Account
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
