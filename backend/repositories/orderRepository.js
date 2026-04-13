const pool = require("../db");

class OrderRepository {
  async create(customerId) {
    const result = await pool.query(
      `INSERT INTO orders (customer_id, total_amount, status, payment_status, payment_method) 
       VALUES ($1, 0, 'pending', 'pending', 'credit_card') 
       RETURNING id`,
      [customerId],
    );
    return result.rows[0];
  }

  async addOrderItem(orderId, productId, quantity, price) {
    const result = await pool.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [orderId, productId, quantity, price],
    );
    return result.rows[0];
  }

  async updateTotalAmount(orderId, totalAmount) {
    const result = await pool.query(
      `UPDATE orders SET total_amount = $1 WHERE id = $2 RETURNING *`,
      [totalAmount, orderId],
    );
    return result.rows[0];
  }

  async createPayment(orderId, amount, method, status, stripePaymentIntentId) {
    const result = await pool.query(
      `INSERT INTO payments (order_id, amount, method, status, stripe_payment_intent_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [orderId, amount, method, status, stripePaymentIntentId],
    );
    return result.rows[0];
  }

  async getCustomerOrders(customerId) {
    const result = await pool.query(
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
                ) FILTER (WHERE oi.id IS NOT NULL), '[]'
              ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN product p ON oi.product_id = p.id
       WHERE o.customer_id = $1
       GROUP BY o.id
       ORDER BY o.order_date DESC`,
      [customerId],
    );
    return result.rows;
  }

  async getOrderById(orderId) {
    const result = await pool.query(
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
                ) FILTER (WHERE oi.id IS NOT NULL), '[]'
              ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN product p ON oi.product_id = p.id
       WHERE o.id = $1
       GROUP BY o.id`,
      [orderId],
    );
    return result.rows[0];
  }

  async updateOrderStatus(orderId, status) {
    const result = await pool.query(
      `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
      [status, orderId],
    );
    return result.rows[0];
  }

  async updatePaymentStatus(orderId, paymentStatus) {
    const result = await pool.query(
      `UPDATE orders SET payment_status = $1 WHERE id = $2 RETURNING *`,
      [paymentStatus, orderId],
    );
    return result.rows[0];
  }

  async getAllOrdersForAdmin() {
    const result = await pool.query(
      `SELECT 
        o.id,
        o.total_amount,
        o.order_date,
        o.status,
        o.payment_status,
        o.manufacturer_id,
        o.customer_id,
        m.name as manufacturer_name,
        c.name as customer_name,
        c.email as customer_email,
        c.phone_number as customer_phone,
        c.address as customer_address
       FROM orders o 
       LEFT JOIN manufacturer m ON o.manufacturer_id = m.id
       LEFT JOIN customer c ON o.customer_id = c.id
       ORDER BY o.order_date DESC`,
    );
    return result.rows;
  }

  async getOrderItemsForOrders(orderIds) {
    if (orderIds.length === 0) return [];

    const placeholders = orderIds.map((_, index) => `$${index + 1}`).join(",");
    const result = await pool.query(
      `SELECT 
        oi.order_id,
        oi.id,
        oi.product_id,
        oi.quantity,
        oi.price,
        p.name as product_name
       FROM order_items oi
       LEFT JOIN product p ON oi.product_id = p.id
       WHERE oi.order_id IN (${placeholders})`,
      orderIds,
    );
    return result.rows;
  }

  async assignManufacturer(orderId, manufacturerId) {
    const result = await pool.query(
      `UPDATE orders 
       SET manufacturer_id = $1, 
           status = 'assigned'
       WHERE id = $2 
       RETURNING *`,
      [manufacturerId, orderId],
    );
    return result.rows[0];
  }

  async getAssignedOrdersForManufacturer(manufacturerId) {
    const result = await pool.query(
      `SELECT 
        o.id as order_id,
        o.customer_id,
        o.total_amount,
        o.status,
        o.order_date,
        o.payment_status,
        o.manufacturer_id,
        m.name as manufacturer_name,
        m.email as manufacturer_email,
        COALESCE(SUM(oi.quantity), 0) as total_quantity,
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
        ) as products
       FROM orders o 
       LEFT JOIN manufacturer m ON o.manufacturer_id = m.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN product p ON oi.product_id = p.id
       WHERE o.manufacturer_id = $1
       GROUP BY o.id, o.customer_id, o.total_amount, o.status, o.order_date, 
                o.payment_status, o.manufacturer_id, m.name, m.email
       ORDER BY o.order_date DESC`,
      [manufacturerId],
    );
    return result.rows;
  }

  async updateProductStock(productId, quantitySold) {
    const result = await pool.query(
      `UPDATE product SET stock = stock - $1, sold = COALESCE(sold, 0) + $1 
       WHERE id = $2 
       RETURNING *`,
      [quantitySold, productId],
    );
    return result.rows[0];
  }

  async updatePaymentRecord(stripeChargeId, stripePaymentIntentId) {
    const result = await pool.query(
      `UPDATE payments 
       SET status = 'paid', stripe_charge_id = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE stripe_payment_intent_id = $2 
       RETURNING *`,
      [stripeChargeId, stripePaymentIntentId],
    );
    return result.rows[0];
  }

  async updatePaymentByOrderId(orderId, status, stripePaymentIntentId) {
    const result = await pool.query(
      `UPDATE payments 
       SET status = $1, stripe_payment_intent_id = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE order_id = $3 
       RETURNING *`,
      [status, stripePaymentIntentId, orderId],
    );
    return result.rows[0];
  }

  async getOrderItems(orderId) {
    const result = await pool.query(
      `SELECT oi.*, p.name AS product_name
       FROM order_items oi
       JOIN product p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [orderId],
    );
    return result.rows;
  }

  async clearCart(customerId) {
    await pool.query(`DELETE FROM cartitem WHERE customer_id = $1`, [
      customerId,
    ]);
  }
}

module.exports = new OrderRepository();
