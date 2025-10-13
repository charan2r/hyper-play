const pool = require("../db");

// Create order from cart
exports.createOrder = async (req, res) => {
  try {
    const customer_id = req.customerId;
    const { payment_intent_id } = req.body;

    // Get cart
    const cart = await pool.query(
      "SELECT id FROM cart WHERE customer_id = $1",
      [customer_id]
    );

    const cart_id = cart.rows[0]?.id;
    if (!cart_id) {
      return res.status(400).json({ error: "Cart empty" });
    }

    // Get cart items
    const items = await pool.query(
      `SELECT ci.*, p.name, p.price
       FROM cartitem ci
       JOIN product p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cart_id]
    );

    if (items.rows.length === 0) {
      return res.status(400).json({ error: "No items in cart" });
    }

    // Calculate total amount
    let total = 0;
    for (let item of items.rows) {
      total += item.quantity * item.price;
    }

    // Create order
    const order = await pool.query(
      `INSERT INTO orders (customer_id, total_amount, order_date, status, payment_intent_id) 
       VALUES ($1, $2, CURRENT_DATE, $3, $4) 
       RETURNING id`,
      [customer_id, total, "confirmed", payment_intent_id]
    );

    const order_id = order.rows[0].id;

    // Create order items
    for (let item of items.rows) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, design_id, sizes, customer_note) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          order_id,
          item.product_id,
          item.quantity,
          item.price,
          item.design_id,
          item.sizes,
          item.customer_note,
        ]
      );
    }

    // Clear cart after successful order creation
    await pool.query("DELETE FROM cartitem WHERE cart_id = $1", [cart_id]);

    res.json({
      success: true,
      order_id,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Get customer orders
exports.getCustomerOrders = async (req, res) => {
  try {
    const customer_id = req.customerId;

    const orders = await pool.query(
      `SELECT o.*, 
              COALESCE(
                JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'id', oi.id,
                    'product_id', oi.product_id,
                    'product_name', p.name,
                    'quantity', oi.quantity,
                    'price', oi.price,
                    'design_id', oi.design_id,
                    'sizes', oi.sizes,
                    'customer_note', oi.customer_note
                  )
                ) FILTER (WHERE oi.id IS NOT NULL), 
                '[]'
              ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN product p ON oi.product_id = p.id
       WHERE o.customer_id = $1
       GROUP BY o.id
       ORDER BY o.order_date DESC`,
      [customer_id]
    );

    res.json({ orders: orders.rows });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get specific order
exports.getOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const customer_id = req.customerId;

    const order = await pool.query(
      `SELECT o.*, 
              COALESCE(
                JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'id', oi.id,
                    'product_id', oi.product_id,
                    'product_name', p.name,
                    'quantity', oi.quantity,
                    'price', oi.price,
                    'design_id', oi.design_id,
                    'sizes', oi.sizes,
                    'customer_note', oi.customer_note
                  )
                ) FILTER (WHERE oi.id IS NOT NULL), 
                '[]'
              ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN product p ON oi.product_id = p.id
       WHERE o.id = $1 AND o.customer_id = $2
       GROUP BY o.id`,
      [order_id, customer_id]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ order: order.rows[0] });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};
