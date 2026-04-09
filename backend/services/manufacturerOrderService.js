const orderRepository = require("../repositories/orderRepository");
const { generatePDF } = require("../utils/generatePDF");

class ManufacturerOrderService {
  async getAssignedOrders(manufacturerId) {
    return await orderRepository.getAssignedOrdersForManufacturer(
      manufacturerId,
    );
  }

  async generateOrderPDF(orderId) {
    const order = await orderRepository.getOrderById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    const items = await orderRepository.getOrderItems(orderId);

    // Generate PDF with order and items
    const pdfBuffer = await generatePDF(order, items);
    return pdfBuffer;
  }
}

module.exports = new ManufacturerOrderService();
