const orderService = require("../services/orderService");

// Create order with Stripe payment
exports.createOrder = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { cartItems, customerInfo } = req.body;

    const orderData = await orderService.createOrder(
      customerId,
      cartItems,
      customerInfo,
    );

    res.status(201).json({
      success: true,
      data: orderData,
    });
  } catch (error) {
    const statusCode = error.message.includes("empty") ? 400 : 500;
    res.status(statusCode).json({
      error: error.message || "Failed to create order",
    });
  }
};

// Get all customer orders
exports.getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user.id;
    const orders = await orderService.getCustomerOrders(customerId);

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Failed to fetch orders",
    });
  }
};

// Get specific order by ID
exports.getOrder = async (req, res) => {
  try {
    const orderId = req.params.order_id;
    const customerId = req.user.id;

    const order = await orderService.getOrderById(orderId);

    // Verify that the order belongs to the customer
    if (order.customer_id !== customerId) {
      return res.status(403).json({
        error: "Unauthorized to access this order",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      error: error.message || "Failed to fetch order",
    });
  }
};
