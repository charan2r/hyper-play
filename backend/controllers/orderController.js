const pool = require("../db");
const crypto = require("crypto");

function generateHash(merchantId, orderId, amount, currency, merchantSecret) {
  const amountFormatted = parseFloat(amount).toFixed(2);
  const hashString =
    merchantId + orderId + amountFormatted + currency + merchantSecret;
  return crypto
    .createHash("md5")
    .update(hashString)
    .digest("hex")
    .toUpperCase();
}

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
      `INSERT INTO orders (customer_id, total_amount, status, payment_status) 
       VALUES ($1, 0, 'pending', 'pending') 
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

    // update total amount in orders table
    await pool.query(`UPDATE orders SET total_amount = $1 WHERE id = $2`, [
      total,
      orderId,
    ]);

    // prepare PayHere payload
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const currency = "LKR";

    const hash = generateHash(
      merchantId,
      orderId,
      total,
      currency,
      merchantSecret
    );

    const payHereData = {
      merchant_id: merchantId,
      return_url: process.env.PAYHERE_RETURN_URL,
      cancel_url: process.env.PAYHERE_CANCEL_URL,
      notify_url: process.env.PAYHERE_NOTIFY_URL,
      order_id: orderId,
      items: "Order Payment",
      amount: total.toFixed(2),
      currency: "LKR",
      first_name: customerInfo.firstName,
      last_name: customerInfo.lastName || "",
      email: customerInfo.email,
      phone: customerInfo.phone || "",
      address: customerInfo.address || "",
      city: customerInfo.city || "",
      country: "Sri Lanka",
      hash,
      custom_1: "hyper-play",
    };

    res.json({
      success: true,
      orderId,
      payHereData,
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
