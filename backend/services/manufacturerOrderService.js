const orderRepository = require("../repositories/orderRepository");
const { generatePDF } = require("../utils/generatePDF");
const { ORDER_STATUS, assertRoleCanTransition } = require("./orderState");

class ManufacturerOrderService {
  async getAssignedOrders(manufacturerId) {
    return await orderRepository.getAssignedOrdersForManufacturer(manufacturerId);
  }

  // Manufacturer updates their own order status.
  async updateManufacturingStatus(orderId, newStatus, manufacturerId, note = null) {
    // Validate against known enum values
    const validStatuses = Object.values(ORDER_STATUS);
    if (!validStatuses.includes(newStatus)) {
      throw new Error(
        `Invalid status: '${newStatus}'. Must be one of: ${validStatuses.join(", ")}`,
      );
    }

    // Enforce role-based permission 
    assertRoleCanTransition("manufacturer", newStatus);

    // Verify this order is actually assigned to this manufacturer
    const orders = await orderRepository.getAssignedOrdersForManufacturer(manufacturerId);
    const assigned = orders.find(
      (o) => o.order_id.toString() === orderId.toString(),
    );

    if (!assigned) {
      throw new Error(
        "Order not found or not assigned to this manufacturer",
      );
    }

    // Transition 
    return await orderRepository.transitionStatus(
      orderId,
      newStatus,
      "manufacturer",
      manufacturerId,
      note,
    );
  }

  async generateOrderPDF(orderId) {
    const order = await orderRepository.getOrderById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    const items = await orderRepository.getOrderItems(orderId);
    const pdfBuffer = await generatePDF(order, items);
    return pdfBuffer;
  }
}

module.exports = new ManufacturerOrderService();
