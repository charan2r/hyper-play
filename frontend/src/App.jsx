import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/User/HomePage.jsx";
import ProductsPage from "./components/User/ProductsPage.jsx";
import ProductDetailsPage from "./components/User/ProductDetailsPage.jsx";
import SportsPage from "./components/User/SportsPage.jsx";
import CartPage from "./components/User/CartPage";
import CheckoutPage from "./components/User/CheckoutPage.jsx";
import OrderSuccessPage from "./components/User/OrderSuccessPage.jsx";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ToastHost from "./components/User/ToastHost.jsx";

export default function App() {
  return (
    <Router>
      <ToastHost />
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
      </Routes>
    </Router>
  );
}
