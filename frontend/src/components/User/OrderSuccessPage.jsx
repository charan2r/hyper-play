import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { CheckCircle, Home, ShoppingBag, Package, Clock } from "lucide-react";
import Navbar from "./Navbar";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [recentOrder, setRecentOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(true);

  const sessionId = new URLSearchParams(window.location.search).get(
    "session_id"
  );

  // 1. Fetch recent order
  const fetchRecentOrder = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch("http://localhost:5000/api/order/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.orders && data.orders.length > 0) {
          setRecentOrder(data.orders[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch recent order:", error);
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently]);

  // 2. Check payment + create order
  const checkPaymentAndCreateOrder = useCallback(async () => {
    if (!sessionId) {
      console.error("No session ID found");
      setCreatingOrder(false);
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      console.log("Checking payment status for session:", sessionId);

      const paymentStatus = await fetch(
        `http://localhost:5000/api/checkout/payment-status/${sessionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ).then((r) => r.json());

      console.log("Payment status:", paymentStatus);

      if (paymentStatus.ready_for_order) {
        console.log(
          "Creating order with payment_intent_id:",
          paymentStatus.payment_intent_id
        );

        const orderResult = await fetch(
          "http://localhost:5000/api/order/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              payment_intent_id: paymentStatus.payment_intent_id,
            }),
          }
        ).then((r) => r.json());

        console.log("Order result:", orderResult);

        if (orderResult.success) {
          console.log("Order created successfully:", orderResult.order_id);
          fetchRecentOrder();
          setCreatingOrder(false);
        } else {
          console.error("Failed to create order:", orderResult);
          setCreatingOrder(false);
        }
      } else {
        console.log("Payment not ready, retrying in 2 seconds...");
        setTimeout(checkPaymentAndCreateOrder, 2000);
      }
    } catch (error) {
      console.error("Error in checkPaymentAndCreateOrder:", error);
      setCreatingOrder(false);
    }
  }, [fetchRecentOrder, getAccessTokenSilently, sessionId]);

  // 3. On mount → check payment → create order → fetch order
  useEffect(() => {
    if (isAuthenticated && sessionId) {
      checkPaymentAndCreateOrder();
    } else {
      setLoading(false);
    }

    return;
  }, [navigate, isAuthenticated, sessionId, checkPaymentAndCreateOrder]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-10 px-4">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg text-center max-w-lg w-full">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6 animate-bounce" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4 font-michroma">
            Order Successful! 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase! Your payment has been processed
            successfully and your custom sports jersey is being prepared.
          </p>

          {/* Order Details */}
          {creatingOrder || loading ? (
            <div className="mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">
                {creatingOrder
                  ? "Finalizing your order..."
                  : "Loading order details..."}
              </p>
            </div>
          ) : recentOrder ? (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-center">
                <Package className="mr-2 w-5 h-5" />
                Order Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-semibold">#{recentOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-green-600">
                    Rs. {recentOrder.total_amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-semibold">
                    {recentOrder.item_count} item(s)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Clock className="w-3 h-3 mr-1" />
                    {recentOrder.status || "Confirmed"}
                  </span>
                </div>
                {recentOrder.product_names && (
                  <div className="pt-2 border-t">
                    <span className="text-gray-600">Products:</span>
                    <p className="font-medium text-gray-800">
                      {recentOrder.product_names}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          <p className="text-sm text-gray-500 mb-8">
            You will receive an order confirmation email shortly with tracking
            details. Your order is now being processed and will be assigned to a
            manufacturer.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/select-sport")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
