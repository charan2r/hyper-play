const pool = require("../db");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await pool.query(
      `SELECT 
        o.id,
        o.total_amount,
        o.order_date,
        o.status,
        o.payment_intent_id,
        o.manufacturer_id,
        o.customer_id,
        m.name as manufacturer_name
       FROM orders o 
       LEFT JOIN manufacturer m ON o.manufacturer_id = m.id
       ORDER BY o.order_date DESC`
    );

    const orderIds = orders.rows.map((order) => order.id);
    let orderItems = [];

    if (orderIds.length > 0) {
      const placeholders = orderIds
        .map((_, index) => `$${index + 1}`)
        .join(",");
      orderItems = await pool.query(
        `SELECT 
          oi.order_id,
          oi.id,
          oi.product_id,
          oi.quantity,
          oi.price,
          oi.design_id,
          oi.sizes,
          oi.customer_note,
          p.name as product_name
         FROM order_items oi
         LEFT JOIN product p ON oi.product_id = p.id
         WHERE oi.order_id IN (${placeholders})`,
        orderIds
      );
    }

    const ordersWithItems = orders.rows.map((order) => {
      const items = orderItems.rows.filter(
        (item) => item.order_id.toString() === order.id.toString()
      );

      return {
        ...order,
        items: items.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          price: item.price,
          design_id: item.design_id,
          sizes: item.sizes,
          customer_note: item.customer_note,
        })),
      };
    });

    const ordersWithPaymentStatus = ordersWithItems.map((order) => ({
      ...order,
      payment_status: order.payment_intent_id ? "Paid" : "Pending",
    }));

    res.json({
      success: true,
      orders: ordersWithPaymentStatus,
    });
  } catch (error) {
    console.error("Error fetching orders for admin:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
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

    // Check if manufacturer exists
    const manufacturer = await pool.query(
      "SELECT id, name FROM manufacturer WHERE id = $1",
      [manufacturer_id]
    );

    if (manufacturer.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Manufacturer not found",
      });
    }

    // Update order with assigned manufacturer
    const result = await pool.query(
      `UPDATE orders 
       SET manufacturer_id = $1, 
           status = CASE 
             WHEN status = 'confirmed' THEN 'processing' 
             ELSE status 
           END
       WHERE id = $2 
       RETURNING *`,
      [manufacturer_id, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      message: `Order assigned to ${manufacturer.rows[0].name}`,
      order: result.rows[0],
    });
  } catch (error) {
    console.error("Error assigning manufacturer:", error);
    res.status(500).json({
      success: false,
      error: "Failed to assign manufacturer",
    });
  }
};

// Get all manufacturers for assignment dropdown
exports.getManufacturers = async (req, res) => {
  try {
    const manufacturers = await pool.query(
      "SELECT id, name, email, phone FROM manufacturer WHERE status = 'active' ORDER BY name"
    );

    res.json({
      success: true,
      manufacturers: manufacturers.rows,
    });
  } catch (error) {
    console.error("Error fetching manufacturers:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch manufacturers",
    });
  }
};
