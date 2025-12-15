import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function OrderFormPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [sportState, setSportState] = useState(state?.sport || "");
  const [fitState, setFitState] = useState(state?.fit || "");
  const [styleState, setStyleState] = useState(state?.style || "");
  const [size, setSize] = useState("medium");
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [designImage, setDesignImage] = useState(state?.designImage || "");
  const [productId] = useState(state?.product_id || null);
  const [designId] = useState(state?.designId || null);

  useEffect(() => {
    const savedOrder = localStorage.getItem("pendingOrder");
    if (savedOrder) {
      const order = JSON.parse(savedOrder);
      setSportState(order.sport || "");
      setFitState(order.fit || "");
      setStyleState(order.style || "");
      setSize(order.size || "medium");
      setQuantity(order.quantity || 1);
      setAddress(order.address || "");
      setDesignImage(order.designImage || "");
      localStorage.removeItem("pendingOrder");
    }
  }, []);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("customerToken");

      const orderData = {
        product_id: productId,
        design_id: designId,
        sizes: size,
        quantity: parseInt(quantity),
        customer_note: `Sport: ${sportState}, Fit: ${fitState}, Style: ${styleState}, Address: ${address}`,
      };

      const response = await fetch("http://localhost:5000/api/customer/cart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Item added to cart successfully:", data);
        navigate("/cart");
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-center overflow-hidden">
        <img
          src="/assets/ogo.png"
          alt="Background Logo"
          className="absolute w-[300px] opacity-10 animate-spin-slow"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotateY(0deg)",
            zIndex: 0,
          }}
        />

        <div className="relative z-10 bg-white shadow-lg rounded-lg p-6 w-full max-w-xl">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 font-michroma">
            Customize Your Order
          </h2>

          {designImage && (
            <div className="flex justify-center mb-6">
              <img
                src={designImage}
                alt="Design Preview"
                className="w-64 h-auto object-contain transform rotate-180 shadow-lg rounded"
              />
            </div>
          )}

          <div className="grid gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Sport</label>
              <select
                value={sportState}
                onChange={(e) => setSportState(e.target.value)}
                className="w-full border px-3 py-2 rounded shadow-sm"
              >
                <option value="Football">Football</option>
                <option value="Basketball">Basketball</option>
                <option value="Baseball">Rugby</option>
                <option value="Soccer">Cricket</option>
                <option value="Tennis">Volleyball</option>
                <option value="Other">Hockey</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Fit</label>
              <input
                value={fitState}
                onChange={(e) => setFitState(e.target.value)}
                className="w-full border px-3 py-2 rounded shadow-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Style</label>
              <input
                value={styleState}
                onChange={(e) => setStyleState(e.target.value)}
                className="w-full border px-3 py-2 rounded shadow-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Size</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full border px-3 py-2 rounded shadow-sm"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border px-3 py-2 rounded shadow-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">
                Delivery Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows="3"
                className="w-full border px-3 py-2 rounded shadow-sm"
              />
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold shadow"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}
