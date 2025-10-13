const pool = require("../db");
const { generatePDF } = require("../utils/generatePDF");

exports.getAssignedOrders = async (req, res) => {
  const manufacturerId = req.user?.manufacturerId || 5;

  try {
    const result = await pool.query(
      `
  SELECT 
    o.id as order_id,
    o.customer_id,
    o.total_amount,
    o.status,
    o.order_date,
    o.payment_intent_id,
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
          'price', oi.price,
          'design_id', oi.design_id,
          'sizes', oi.sizes,
          'customer_note', oi.customer_note,
          'design_data', d.design_data
        )
      ) FILTER (WHERE oi.id IS NOT NULL), 
      '[]'
    ) as products,

    
    CASE WHEN COUNT(d.id) > 0 THEN true ELSE false END as assets_available,
    COALESCE(JSON_AGG(d.design_data) FILTER (WHERE d.id IS NOT NULL), '[]') as asset_files,
    COUNT(d.id) as template_count

    FROM orders o 
    LEFT JOIN manufacturer m ON o.manufacturer_id = m.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN product p ON oi.product_id = p.id
    LEFT JOIN design d ON d.id = oi.design_id   

    WHERE o.manufacturer_id = $1
    GROUP BY o.id, o.customer_id, o.total_amount, o.status, o.order_date, 
            o.payment_intent_id, o.manufacturer_id, m.name, m.email
    ORDER BY o.order_date DESC
    `,
      [manufacturerId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching assigned orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

exports.getDesignPDF = async (req, res) => {
  const { id } = req.params;

  try {
    const orderRes = await pool.query(
      `
      SELECT o.*
      FROM orders o
      WHERE o.id = $1
    `,
      [id]
    );

    const itemsRes = await pool.query(
      `
      SELECT oi.*, p.name AS product_name, d.design_data
      FROM order_items oi
      JOIN product p ON oi.product_id = p.id
      LEFT JOIN design d ON d.id = oi.design_id
      WHERE oi.order_id = $1
      `,
      [id]
    );

    const pdfBuffer = await generatePDF(orderRes.rows[0], itemsRes.rows);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=order_${id}.pdf`,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};
