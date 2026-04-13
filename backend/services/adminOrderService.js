const orderRepository = require("../repositories/orderRepository");
const userRepository = require("../repositories/userRepository");

class AdminOrderService {
  async getAllOrders() {
    const orders = await orderRepository.getAllOrdersForAdmin();
    const orderIds = orders.map((order) => order.id);

    let orderItems = [];
    if (orderIds.length > 0) {
      orderItems = await orderRepository.getOrderItemsForOrders(orderIds);
    }

    // Map items to each order
    const ordersWithItems = orders.map((order) => {
      const items = orderItems.filter(
        (item) => item.order_id.toString() === order.id.toString(),
      );

      return {
        ...order,
        items: items.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          price: item.price,
        })),
      };
    });

    return ordersWithItems;
  }

  async assignManufacturer(orderId, manufacturerId) {
    // Check if manufacturer exists
    const manufacturer =
      await userRepository.getManufacturerById(manufacturerId);
    if (!manufacturer) {
      throw new Error("Manufacturer not found");
    }

    // Update order with assigned manufacturer
    const order = await orderRepository.assignManufacturer(
      orderId,
      manufacturerId,
    );
    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }

  async getManufacturers() {
    return await userRepository.getActiveManufacturers();
  }

  async updateOrderStatus(orderId, status) {
    const order = await orderRepository.updateOrderStatus(orderId, status);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }
}

module.exports = new AdminOrderService();
