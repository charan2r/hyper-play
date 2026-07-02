const pool = require("../db");
const { assertTransition } = require("../services/orderState");

class OrderRepository {
  // Order creation
  async create(customerId) {
    const result = await pool.query(
      `INSERT INTO orders (customer_id, total_amount, status, payment_status, payment_method)
       VALUES ($1, 0, 'PENDING_PAYMENT', 'PENDING', 'CREDIT_CARD')
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
        `SELECT status FROM orders WHERE id = $1 `,
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

      // Keep manufacturing_assignments in sync
      if (newStatus === 'IN_PRODUCTION') {
        await db.query(
          `UPDATE manufacturing_assignments 
           SET manufacturing_status = 'IN_PRODUCTION', started_at = CURRENT_TIMESTAMP 
           WHERE order_id = $1 AND manufacturing_status = 'ASSIGNED'`,
          [orderId]
        );
      } else if (newStatus === 'PACKED') {
        await db.query(
          `UPDATE manufacturing_assignments 
           SET manufacturing_status = 'COMPLETED', completed_at = CURRENT_TIMESTAMP 
           WHERE order_id = $1 AND manufacturing_status = 'IN_PRODUCTION'`,
          [orderId]
        );
      } else if (newStatus === 'CANCELLED') {
        await db.query(
          `UPDATE manufacturing_assignments 
           SET manufacturing_status = 'REJECTED', completed_at = CURRENT_TIMESTAMP 
           WHERE order_id = $1 AND manufacturing_status IN ('ASSIGNED', 'IN_PRODUCTION')`,
          [orderId]
        );
      }

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

 
  // Create a manufacturing assignment record (performs capacity check & logs assignment)
  async createManufacturingAssignment(orderId, manufacturerId, client = null) {
    const db = client || pool;

    const manufacturerRes = await db.query(
      `SELECT capacity, name, status FROM manufacturer WHERE id = $1`,
      [manufacturerId]
    );

    if (manufacturerRes.rows.length === 0) {
      throw new Error("Manufacturer not found");
    }

    const manufacturer = manufacturerRes.rows[0];
    if (manufacturer.status !== 'active') {
      throw new Error(`Manufacturer '${manufacturer.name}' is not active`);
    }

    const capacity = manufacturer.capacity || 10;

    const countRes = await db.query(
      `SELECT COUNT(*)::int AS count 
       FROM manufacturing_assignments 
       WHERE manufacturer_id = $1 AND manufacturing_status IN ('ASSIGNED', 'IN_PRODUCTION')`,
      [manufacturerId]
    );

    const activeCount = countRes.rows[0].count;
    if (activeCount >= capacity) {
      throw new Error(`Manufacturer '${manufacturer.name}' is at full capacity (${activeCount}/${capacity})`);
    }

    // Cancel/reject any existing active assignments for this order
    await db.query(
      `UPDATE manufacturing_assignments 
       SET manufacturing_status = 'REJECTED', completed_at = CURRENT_TIMESTAMP
       WHERE order_id = $1 AND manufacturing_status IN ('ASSIGNED', 'IN_PRODUCTION')`,
      [orderId]
    );

    // Insert new assignment
    const result = await db.query(
      `INSERT INTO manufacturing_assignments (order_id, manufacturer_id, manufacturing_status, assigned_at)
       VALUES ($1, $2, 'ASSIGNED', CURRENT_TIMESTAMP)
       RETURNING *`,
      [orderId, manufacturerId]
    );

    return {
      assignment: result.rows[0],
      manufacturer: {
        id: manufacturer.id,
        name: manufacturer.name
      }
    };
  }

  // Atomically assign manufacturer and transition status to ASSIGNED in a single transaction
  async assignManufacturerWithTransaction(orderId, manufacturerId, adminId) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const assignmentInfo = await this.createManufacturingAssignment(orderId, manufacturerId, client);

      const order = await this.transitionStatus(
        orderId,
        "ASSIGNED",
        "admin",
        adminId,
        `Assigned to manufacturer: ${assignmentInfo.manufacturer.name}`,
        client
      );

      await client.query("COMMIT");
      return { ...order, manufacturer: assignmentInfo.manufacturer };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async assignManufacturer(orderId, manufacturerId) {
    throw new Error(
      "assignManufacturer is deprecated. Use assignManufacturerWithTransaction instead."
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

 
  // Check stock and reserve
  async checkAndReserveStock(orderId, items, client = null) {
    const db = client || pool;
    const ownTransaction = !client;
  
    if (ownTransaction) {
      await db.query("BEGIN");
    }
  
    try {
      const productIds = items.map(i => i.product_id);
  
      // 1. Lock products ONLY
      const productRes = await db.query(
        `SELECT id, name, stock
         FROM product
         WHERE id = ANY($1)
         FOR UPDATE`,
        [productIds]
      );
  
      const products = {};
      productRes.rows.forEach(p => {
        products[p.id] = {
          name: p.name,
          stock: parseInt(p.stock)
        };
      });
  
      // 2. Get reserved quantities separately
      const reservedRes = await db.query(
        `SELECT product_id,
                COALESCE(SUM(quantity), 0) AS reserved_qty
         FROM inventory_reservations
         WHERE product_id = ANY($1)
           AND inventory_reservation_status = 'RESERVED'
         GROUP BY product_id`,
        [productIds]
      );
  
      const reservedMap = {};
      reservedRes.rows.forEach(r => {
        reservedMap[r.product_id] = parseInt(r.reserved_qty);
      });
  
      // 3. Validate + reserve
      for (const item of items) {
        const p = products[item.product_id];
        if (!p) {
          throw new Error(`Product ${item.product_id} not found`);
        }
  
        const reserved = reservedMap[item.product_id] || 0;
        const available = p.stock - reserved;
  
        if (available < item.quantity) {
          throw new Error(
            `Insufficient stock for ${p.name}. Available: ${available}, Requested: ${item.quantity}`
          );
        }
  
        await db.query(
          `INSERT INTO inventory_reservations 
           (product_id, order_id, quantity, inventory_reservation_status)
           VALUES ($1, $2, $3, 'RESERVED')`,
          [item.product_id, orderId, item.quantity]
        );
      }
  
      if (ownTransaction) {
        await db.query("COMMIT");
      }
  
    } catch (err) {
      if (ownTransaction) {
        await db.query("ROLLBACK");
      }
      throw err;
    }
  }

  // Confirm reservations on payment success 
  async confirmInventory(orderId, client = null) {
    const db = client || pool;
    const ownTransaction = !client;

    if (ownTransaction) {
      await db.query("BEGIN");
    }

    try {
      const resResult = await db.query(
        `SELECT id, product_id, quantity FROM inventory_reservations
         WHERE order_id = $1 AND inventory_reservation_status = 'RESERVED'`,
        [orderId]
      );

      for (const row of resResult.rows) {
        await db.query(
          `UPDATE inventory_reservations
           SET inventory_reservation_status = 'CONVERTED'
           WHERE id = $1`,
          [row.id]
        );

        await db.query(
          `UPDATE product
           SET stock = stock - $1, sold = COALESCE(sold, 0) + $1
           WHERE id = $2`,
          [row.quantity, row.product_id]
        );
      }

      if (ownTransaction) {
        await db.query("COMMIT");
      }
    } catch (error) {
      if (ownTransaction) {
        await db.query("ROLLBACK");
      }
      throw error;
    }
  }

  // Release reservations on cancel/fail
  async releaseInventory(orderId, client = null) {
    const db = client || pool;
    const ownTransaction = !client;

    if (ownTransaction) {
      await db.query("BEGIN");
    }

    try {
      const resResult = await db.query(
        `SELECT id, product_id, quantity, inventory_reservation_status
         FROM inventory_reservations
         WHERE order_id = $1 AND inventory_reservation_status IN ('RESERVED', 'CONVERTED')`,
        [orderId]
      );

      for (const row of resResult.rows) {
        await db.query(
          `UPDATE inventory_reservations
           SET inventory_reservation_status = 'RELEASED'
           WHERE id = $1`,
          [row.id]
        );

        if (row.inventory_reservation_status === 'CONVERTED') {
          await db.query(
            `UPDATE product
             SET stock = stock + $1, sold = GREATEST(COALESCE(sold, 0) - $1, 0)
             WHERE id = $2`,
            [row.quantity, row.product_id]
          );
        }
      }

      if (ownTransaction) {
        await db.query("COMMIT");
      }
    } catch (error) {
      if (ownTransaction) {
        await db.query("ROLLBACK");
      }
      throw error;
    }
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
