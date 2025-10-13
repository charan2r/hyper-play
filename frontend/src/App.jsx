import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Customisation from "./components/User/Customisation";
import HomePage from "./components/User/HomePage";
import ProductsPage from "./components/User/ProductsPage";
import ProductDetailsPage from "./components/User/ProductDetailsPage";
import SportsPage from "./components/User/SportsPage";
import AboutPage from "./components/User/AboutPage";
import SelectSportPage from "./components/User/SelectSportPage";
import CustomDesignPage from './components/User/CustomDesignPage';
import OrderFormPage from "./components/User/OrderFormPage";
import CartPage from "./components/User/CartPage";
import CheckoutPage from "./components/User/CheckoutPage";
import ContactPage from "./components/User/ContactPage";
import FAQ from "./components/User/FAQ";
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
        <Route path="/select-sport" element={<SelectSportPage />} />
        <Route path="/custom-design" element={<CustomDesignPage />} />
        <Route path="/design-editor" element={<Customisation />} />
        <Route path="/order-form" element={<OrderFormPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </Router>
  );
}
