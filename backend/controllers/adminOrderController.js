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

    if (!manufacturer_id) {
      return res.status(400).json({
        success: false,
        error: "Manufacturer ID is required",
      });
    }

    const order = await adminOrderService.assignManufacturer(
      orderId,
      manufacturer_id,
    );

    const manufacturers = await adminOrderService.getManufacturers();
    const assignedManufacturer = manufacturers.find(
      (m) => m.id === manufacturer_id,
    );

    res.json({
      success: true,
      message: `Order assigned to ${assignedManufacturer?.name || "manufacturer"}`,
      data: order,
    });
  } catch (error) {
    const statusCode = error.message.includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message || "Failed to assign manufacturer",
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
      error: error.message || "Failed to fetch manufacturers",
    });
  }
};
