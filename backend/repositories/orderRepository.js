const pool = require("../db");
const { assertTransition } = require("../services/orderState");

class OrderRepository {
  // Order creation
  async create(customerId) {
    const result = await pool.query(
      `INSERT INTO orders (customer_id, total_amount, status, payment_status, payment_method)
       VALUES ($1, 0, 'PENDING_PAYMENT', 'PENDING', 'CARD')
       RETURNING id`,
      [customerId],
    );
    return result.rows[0];
  }


  // Add Order items
  async addOrderItem(orderId, productId, quantity, price) {
    const result = await pool.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [orderId, productId, quantity, price],
    );
    return result.rows[0];
  }

  // Get Order items
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

  // Update total amount
  async updateTotalAmount(orderId, totalAmount) {
    const result = await pool.query(
      `UPDATE orders SET total_amount = $1 WHERE id = $2 RETURNING *`,
      [totalAmount, orderId],
    );
    return result.rows[0];
  }

  // Create payment
  async createPayment(orderId, amount, method, status, stripePaymentIntentId) {
    const result = await pool.query(
      `INSERT INTO payments (order_id, amount, method, status, stripe_payment_intent_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [orderId, amount, method, status, stripePaymentIntentId],
    );
    return result.rows[0];
  }

  // Update payment status
  async updatePaymentStatus(orderId, paymentStatus) {
    const result = await pool.query(
      `UPDATE orders SET payment_status = $1 WHERE id = $2 RETURNING *`,
      [paymentStatus, orderId],
    );
    return result.rows[0];
  }

  // Update payment record
  async updatePaymentRecord(stripeChargeId, stripePaymentIntentId) {
    const result = await pool.query(
      `UPDATE payments
       SET status = 'SUCCESS', stripe_charge_id = $1, updated_at = CURRENT_TIMESTAMP
       WHERE stripe_payment_intent_id = $2
       RETURNING *`,
      [stripeChargeId, stripePaymentIntentId],
    );
    return result.rows[0];
  }

  // Update payment by order ID
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


  // Status transitions
  /**
   * Atomically transitions an order to a new status and records the change in order_status_history table. 
   * @param {number} orderId
   * @param {string} newStatus     - target ORDER_STATUS value
   * @param {string} changedByRole - 'admin' | 'manufacturer' | 'customer' | 'system'
   * @param {number|null} changedById
   * @param {string|null} note
   * @param {object|null} client   
   */
  async transitionStatus(
    orderId,
    newStatus,
    changedByRole,
    changedById = null,
    note = null,
    client = null,
  ) {
    const db = client || pool;
    const ownTransaction = !client;

    if (ownTransaction) {
      await db.query("BEGIN");
    }

    try {
      // Lock the row and read current status
      const lockResult = await db.query(
        `SELECT status FROM orders WHERE id = $1 FOR UPDATE`,
        [orderId],
      );

      if (lockResult.rows.length === 0) {
        throw new Error(`Order ${orderId} not found`);
      }

      const currentStatus = lockResult.rows[0].status;

      // Guard: throws if the transition is illegal
      assertTransition(currentStatus, newStatus);

      // Apply the new status
      const updateResult = await db.query(
        `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
        [newStatus, orderId],
      );

      // Record the history
      await db.query(
        `INSERT INTO order_status_history
           (order_id, previous_status, new_status, changed_by_role, changed_by_id, note)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, currentStatus, newStatus, changedByRole, changedById, note],
      );

      if (ownTransaction) {
        await db.query("COMMIT");
      }

      return updateResult.rows[0];
    } catch (err) {
      if (ownTransaction) {
        await db.query("ROLLBACK");
      }
      throw err;
    }
  }


  // Get customer orders
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

  // Get order by ID
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

 // Get all orders for admin
  async getAllOrdersForAdmin() {
    const result = await pool.query(
      `SELECT
         o.id,
         o.total_amount,
         o.order_date,
         o.status,
         o.payment_status,
         o.customer_id,
         ma.manufacturer_id,
         ma.manufacturing_status,
         m.name   AS manufacturer_name,
         c.name   AS customer_name,
         c.email  AS customer_email,
         c.phone_number AS customer_phone,
         c.address AS customer_address
       FROM orders o
       LEFT JOIN manufacturing_assignments ma ON ma.order_id = o.id
       LEFT JOIN manufacturer m ON ma.manufacturer_id = m.id
       LEFT JOIN customer c ON o.customer_id = c.id
       ORDER BY o.order_date DESC`,
    );
    return result.rows;
  }

  // Get order items for orders
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
         p.name AS product_name
       FROM order_items oi
       LEFT JOIN product p ON oi.product_id = p.id
       WHERE oi.order_id IN (${placeholders})`,
      orderIds,
    );
    return result.rows;
  }

 
  async assignManufacturer(_orderId, _manufacturerId) {
    throw new Error(
      "assignManufacturer is not implemented. " +
        "Use the manufacturing_assignments table via adminOrderService.assignManufacturer().",
    );
  }

  async getAssignedOrdersForManufacturer(manufacturerId) {
    const result = await pool.query(
      `SELECT
         o.id         AS order_id,
         o.customer_id,
         o.total_amount,
         o.status,
         o.order_date,
         o.payment_status,
         ma.manufacturer_id,
         ma.manufacturing_status,
         ma.assigned_at,
         ma.started_at,
         ma.completed_at,
         m.name  AS manufacturer_name,
         m.email AS manufacturer_email,
         COALESCE(SUM(oi.quantity), 0) AS total_quantity,
         COALESCE(
           JSON_AGG(
             JSON_BUILD_OBJECT(
               'id',           oi.id,
               'product_id',   oi.product_id,
               'product_name', p.name,
               'quantity',     oi.quantity,
               'price',        oi.price
             )
           ) FILTER (WHERE oi.id IS NOT NULL),
           '[]'
         ) AS products
       FROM manufacturing_assignments ma
       JOIN orders o       ON o.id  = ma.order_id
       JOIN manufacturer m ON m.id  = ma.manufacturer_id
       LEFT JOIN order_items oi ON oi.order_id = o.id
       LEFT JOIN product p      ON p.id = oi.product_id
       WHERE ma.manufacturer_id = $1
       GROUP BY
         o.id, o.customer_id, o.total_amount, o.status, o.order_date,
         o.payment_status, ma.manufacturer_id, ma.manufacturing_status,
         ma.assigned_at, ma.started_at, ma.completed_at,
         m.name, m.email
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

 // Clear cart
  async clearCart(customerId) {
    await pool.query(`DELETE FROM cartitem WHERE customer_id = $1`, [
      customerId,
    ]);
  }
}

module.exports = new OrderRepository();
