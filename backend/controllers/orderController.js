const pool = require("../db");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create order and pay
exports.createOrder = async (req, res) => {
  try {
    const customer_id = req.user.id;
    const { cartItems, customerInfo } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate customer info for payment
    if (!customerInfo || !customerInfo.firstName || !customerInfo.email) {
      return res
        .status(400)
        .json({ message: "Customer information is required" });
    }

    // Create order
    const order = await pool.query(
      `INSERT INTO orders (customer_id, total_amount, status, payment_status, payment_method) 
       VALUES ($1, 0, 'pending', 'pending','credit_card') 
       RETURNING id`,
      [customer_id]
    );

    const orderId = order.rows[0].id;

    let total = 0;

    // insert into order items
    for (const item of cartItems) {
      const product = await pool.query(
        `SELECT price FROM product WHERE id = $1`,
        [item.product_id]
      );

      const price = product.rows[0].price;
      total += price * item.quantity;

      await pool.query(
        `INSERT INTO order_items(order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, price]
      );
    }

    // create stripe paymentintent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total),
      currency: "lkr",
      metadata: {
        order_id: orderId,
        customer_id: customer_id,
      },
    });

    // save payment record
    await pool.query(
      `insert into payments(order_id, amount, method, status, stripe_payment_intent_id)
      values($1, $2, $3, $4, $5)`,
      [orderId, total, "credit_card", "pending", paymentIntent.id]
    );

    // update total amount in orders table
    await pool.query(`UPDATE orders SET total_amount = $1 WHERE id = $2`, [
      total,
      orderId,
    ]);

    res.json({
      success: true,
      orderId,
      clientSecret: paymentIntent.client_secret,
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
    const customer_id = req.user.id;

    const orders = await pool.query(
      `SELECT o.*, 
              COALESCE(
                JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'id', oi.id,
                    'product_id', oi.product_id,
                    'product_name', p.name,
                    'quantity', oi.quantity,
                    'price', oi.price
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
    const customer_id = req.user.id;

    const order = await pool.query(
      `SELECT o.*, 
              COALESCE(
                JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'id', oi.id,
                    'product_id', oi.product_id,
                    'product_name', p.name,
                    'quantity', oi.quantity,
                    'price', oi.price
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
