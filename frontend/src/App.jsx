import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/User/HomePage";
import ProductsPage from "./components/User/ProductsPage";
import ProductDetailsPage from "./components/User/ProductDetailsPage";
import SportsPage from "./components/User/SportsPage";
import AboutPage from "./components/User/AboutPage";
import CartPage from "./components/User/CartPage";
import CheckoutPage from "./components/User/CheckoutPage";
import ContactPage from "./components/User/ContactPage";
import OrderSuccessPage from "./components/User/OrderSuccessPage";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/sports" element={<SportsPage />} />
        <Route path="/sports/:sport" element={<SportsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}
