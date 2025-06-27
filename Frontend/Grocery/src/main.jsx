import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./Components/CartContext";
import { AuthProvider } from "./Components/AuthContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
      <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>,
  </BrowserRouter>
);
