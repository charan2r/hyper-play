const adminOrderService = require("../services/adminOrderService");

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await adminOrderService.getAllOrders();

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch orders",
    });
  }
};

// Assign manufacturer to order
exports.assignManufacturer = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { manufacturer_id } = req.body;
    const adminId = req.user?.id;

    if (!manufacturer_id) {
      return res.status(400).json({
        success: false,
        error: "Manufacturer ID is required",
      });
    }

    const order = await adminOrderService.assignManufacturer(
      orderId,
      manufacturer_id,
      adminId,
    );

    res.json({
      success: true,
      message: `Order assigned to ${order.manufacturer?.name}`,
      data: order,
    });
  } catch (error) {
    const statusCode = error.message.includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all manufacturers for assignment dropdown
exports.getManufacturers = async (req, res) => {
  try {
    const manufacturers = await adminOrderService.getManufacturers();

    res.json({
      success: true,
      data: manufacturers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;
    const adminId = req.user?.id;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status is required",
      });
    }

    const order = await adminOrderService.updateOrderStatus(
      orderId,
      status,
      adminId,
      note || null,
    );

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    const isNotFound = error.message.includes("not found");
    const isInvalidTransition =
      error.message.includes("transition") ||
      error.message.includes("permitted");
    const statusCode = isNotFound ? 404 : isInvalidTransition ? 422 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
};
