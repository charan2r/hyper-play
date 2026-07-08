const orderRepository = require("../repositories/orderRepository");
const userRepository = require("../repositories/userRepository");
const {
  ORDER_STATUS,
  assertRoleCanTransition,
} = require("./orderState");

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

 
  async assignManufacturer(orderId, manufacturerId, adminId) {
    return await orderRepository.assignManufacturerWithTransaction(
      orderId,
      manufacturerId,
      adminId,
    );
  }

  // Auto-pick the manufacturer with free capacity and assign them.
  async autoAssignManufacturer(orderId) {
    const manufacturer = await orderRepository.findAvailableManufacturer();

    if (!manufacturer) {
      console.warn(
        `No available manufacturer for order ${orderId}. ` +
          `Order will remain in PAID status until manually assigned.`,
      );
      return null;
    }

   
    const result = await orderRepository.assignManufacturerWithTransaction(
      orderId,
      manufacturer.id,
      null, 
    );

    console.info(
      `Order ${orderId} auto-assigned to manufacturer ` +
        `'${manufacturer.name}' (id=${manufacturer.id}, ` +
        `active=${manufacturer.active_count + 1}).`,
    );

    return result;
  }

  async getManufacturers() {
    return await userRepository.getActiveManufacturers();
  }


  async updateOrderStatus(orderId, status, adminId, note = null) {
    // Validate the requested status is a known enum value
    const validStatuses = Object.values(ORDER_STATUS);
    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid order status: '${status}'. Must be one of: ${validStatuses.join(", ")}`,
      );
    }

    // Enforce role-based permission
    assertRoleCanTransition("admin", status);

    // Enforce state machine transition
    const order = await orderRepository.transitionStatus(
      orderId,
      status,
      "admin",
      adminId,
      note,
    );

    if (!order) {
      throw new Error("Order not found");
    }

    if (status === ORDER_STATUS.CANCELLED) {
      await orderRepository.releaseInventory(orderId);
    }

    return order;
  }
}

module.exports = new AdminOrderService();
