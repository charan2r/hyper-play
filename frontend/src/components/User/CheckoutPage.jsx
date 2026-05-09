import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API_URL from "../../config/api";
import { CreditCard, MapPin, User, Phone, Mail, ArrowLeft } from "lucide-react";
import Navbar from "./Navbar";

function sumCartItems(items) {
  return items.reduce((sum, item) => {
    return sum + (Number(item.price) || 0) * (Number(item.quantity) || 0);
  }, 0);
}

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const [cartItems, setCartItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [loadingCart, setLoadingCart] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoadingCart(true);

    const applyFromState = () => {
      const fromNav = state?.cartItems;
      if (Array.isArray(fromNav) && fromNav.length > 0) {
        setCartItems(fromNav);
        const t =
          typeof state.total === "number" && state.total >= 0
            ? state.total
            : sumCartItems(fromNav);
        setOrderTotal(t);
        setLoadingCart(false);
        return true;
      }
      return false;
    };

    const loadFromApi = async () => {
      const token = localStorage.getItem("customerToken");
      if (!token) {
        if (!cancelled) {
          setCartItems([]);
          setOrderTotal(0);
          setLoadingCart(false);
        }
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/customer/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          if (!cancelled) {
            setCartItems([]);
            setOrderTotal(0);
          }
          return;
        }
        const data = await response.json();
        const items = Array.isArray(data) ? data : [];
        if (!cancelled) {
          setCartItems(items);
          setOrderTotal(sumCartItems(items));
        }
      } catch {
        if (!cancelled) {
          setCartItems([]);
          setOrderTotal(0);
        }
      } finally {
        if (!cancelled) setLoadingCart(false);
      }
    };

    if (!applyFromState()) {
      loadFromApi();
    }

    return () => {
      cancelled = true;
    };
  }, [location.key, state]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.zipCode
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (!cartItems.length) {
      alert("Your cart is empty. Add items before checkout.");
      navigate("/cart");
      return;
    }

    try {
      setIsProcessing(true);

      const token = localStorage.getItem("customerToken");
      if (!token) {
        alert("Please login to continue");
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/order/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cartItems: cartItems.map((item) => ({
            product_id: item.product_id ?? item.id,
            quantity: item.quantity,
          })),
          customerInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !data.data) {
        alert(data.error || "Checkout failed");
        setIsProcessing(false);
        return;
      }

      const orderData = data.data;
      // Redirect to Stripe hosted checkout using their official redirect URL
      if (orderData.redirectUrl) {
        window.location.href = orderData.redirectUrl;
      } else {
        alert("No payment redirect URL received from server");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert(err.message || "Something went wrong");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-gray-100 py-10 px-4">
        {/* Background Logo */}
        <img
          src="/assets/logo.png"
          alt="Background Logo"
          className="absolute w-[300px] opacity-5 animate-spin-slow"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotateY(0deg)",
            zIndex: 0,
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => navigate("/cart")}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <CreditCard className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-800 font-michroma">
                  Checkout
                </h1>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Billing & Shipping Information
              </h2>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">
                      <User className="inline h-4 w-4 mr-1" />
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Address Information */}
                <div>
                  <label className="block text-gray-700 mb-1">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={
                    isProcessing || loadingCart || cartItems.length === 0
                  }
                  className={`w-full mt-8 py-4 rounded-lg font-semibold text-lg transition-colors ${
                    isProcessing || loadingCart || cartItems.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Pay Now"
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white shadow-lg rounded-lg p-6 h-fit">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Order Summary
              </h2>

              {loadingCart ? (
                <p className="text-gray-600 py-8 text-center">
                  Loading your order…
                </p>
              ) : cartItems.length === 0 ? (
                <p className="text-gray-600 py-8 text-center">
                  Your cart is empty.{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="text-green-600 font-semibold underline"
                  >
                    Continue shopping
                  </button>
                </p>
              ) : (
                <div className="space-y-4 mb-6">
                  {cartItems.map((item, index) => {
                    const lineTotal =
                      (Number(item.price) || 0) * (Number(item.quantity) || 0);
                    return (
                      <div
                        key={item.id ?? item.product_id ?? index}
                        className="flex items-center space-x-4 pb-4 border-b"
                      >
                        {item.design_data && (
                          <img
                            src={
                              typeof item.design_data === "string"
                                ? item.design_data
                                : item.design_data.imageURL || item.design_data
                            }
                            alt="Custom Design"
                            className="w-16 h-16 object-contain bg-gray-50 rounded"
                            onError={(e) => {
                              console.error(
                                "Design image failed to load in checkout:",
                                item.design_data,
                              );
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {item.name || "Custom Sports Jersey"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                          {item.customer_note && (
                            <p className="text-sm text-gray-600">
                              {item.customer_note}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">
                            Rs. {lineTotal.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Order Total */}
              {!loadingCart && cartItems.length > 0 && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">
                      Rs. {orderTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-semibold">Rs. 0</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">
                      Total:
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      Rs. {orderTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center text-sm text-gray-600">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span>Secure SSL encrypted payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
