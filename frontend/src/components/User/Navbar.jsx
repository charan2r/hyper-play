import { useState, useEffect } from "react";
import {
  ChevronDown,
  Menu,
  X,
  Search,
  ShoppingCart,
  LogIn,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [sportsDropdown, setSportsDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    const userData = localStorage.getItem("customerUser");

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customerUser");
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/";
  };

  const shopItems = [
    "Jerseys",
    "Tracksuits",
    "Bottoms & Shorts",
    "Lifestyle Kits",
    "Bestsellers",
    "Hoodies",
    "Accessories",
    "Custom Jersey",
  ];

  const sportsItems = [
    "Cricket",
    "Football",
    "Rugby",
    "Volleyball",
    "Basketball",
    "Hockey",
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Menu Items */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-gray-900 hover:text-green-600 px-3 py-2 text-lg font-medium transition-colors"
            >
              Home
            </a>

            {/* Shop Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShopDropdown(!shopDropdown)}
                className="text-gray-900 hover:text-green-600 px-3 py-2 text-lg font-medium flex items-center transition-colors"
              >
                Shop <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {shopDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                  <a
                    href="/products"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors font-semibold border-b border-gray-100"
                  >
                    All Products
                  </a>
                  {shopItems.map((item) => (
                    <a
                      key={item}
                      href={`/products?category=${encodeURIComponent(item)}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Sports Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSportsDropdown(!sportsDropdown)}
                className="text-gray-900 hover:text-green-600 px-3 py-2 text-lg font-medium flex items-center transition-colors"
              >
                Sports <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {sportsDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                  <a
                    href="/sports"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors font-semibold border-b border-gray-100"
                  >
                    All Sports
                  </a>
                  {sportsItems.map((sport) => (
                    <a
                      key={sport}
                      href={`/sports?sport=${encodeURIComponent(sport)}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      {sport}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              {/* Logo placeholder 
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                <img src="fit.jpg" />
              </div>*/}
              <span className="ml-2 text-xl font-bold text-gray-900">
                Hyper Play
              </span>
            </div>
          </div>

          {/* Right Menu Items */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/about"
              className="text-gray-900 hover:text-green-600 px-3 py-2 text-lg font-medium transition-colors"
            >
              About us
            </a>
            <a
              href="/faq"
              className="text-gray-900 hover:text-green-600 px-3 py-2 text-lg font-medium transition-colors"
            >
              Faq
            </a>
            {/* Search Icon */}
            <button className="text-gray-900 hover:text-green-600 p-2 transition-colors">
              <Search className="h-6 w-6" />
            </button>
            {/* Cart Icon */}
            <button
              className="text-gray-900 hover:text-green-600 p-2 transition-colors"
              onClick={() => (window.location.href = "/cart")}
            >
              <ShoppingCart className="h-6 w-6" />
            </button>

            {/* Login/Logout */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Hello, {user?.name}
                </span>
                <button
                  className="text-gray-900 hover:text-red-600 p-2 transition-colors"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <button
                className="text-gray-900 hover:text-green-600 p-2 transition-colors"
                onClick={() => (window.location.href = "/login")}
                title="Login"
              >
                <LogIn className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 hover:text-green-600 p-2"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              <a
                href="/"
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
              >
                Home
              </a>
              <a
                href="/products"
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
              >
                Shop
              </a>
              <a
                href="/sports"
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
              >
                Sports
              </a>
              <a
                href="/about"
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
              >
                About us
              </a>
              <a
                href="/faq"
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
              >
                FAQ
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
