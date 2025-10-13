const pool = require("../db");

// customer fetch products
exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM product WHERE LOWER(status) = 'active'"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// customer adding designs
exports.addDesign = async (req, res) => {
  const { design_data } = req.body;
  const customer_id = req.user.id;

  try {
    // Validate input
    if (!design_data) {
      return res.status(400).json({ error: "Design data is required" });
    }

    const designDataWithProduct = {
      ...design_data,
    };

    const result = await pool.query(
      `INSERT INTO design (customer_id, design_data) VALUES ($1, $2) RETURNING *`,
      [customer_id.toString(), JSON.stringify(designDataWithProduct)]
    );

    console.log("Design saved successfully with ID:", result.rows[0].id);
    res.status(201).json({
      ...result.rows[0],
      design_data: result.rows[0].design_data,
    });
  } catch (error) {
    console.error("Error saving design:", error);
    res.status(500).json({ error: "Failed to add design" });
  }
};

// customer viewing designs
exports.getDesign = async (req, res) => {
  const customer_id = req.user.id;
  try {
    const result = await pool.query(
      "SELECT * FROM design WHERE customer_id = $1 ORDER BY created_at DESC",
      [customer_id.toString()]
    );

    // Parse the JSON design_data for each design
    const designs = result.rows.map((design) => ({
      ...design,
      design_data:
        typeof design.design_data === "string"
          ? JSON.parse(design.design_data)
          : design.design_data,
    }));

    res.json(designs);
  } catch (error) {
    console.error("Error fetching designs:", error);
    res.status(500).json({ error: "Failed to get design" });
  }
};

// view cart items
exports.getCart = async (req, res) => {
  try {
    const customer_id = req.user?.id;
    if (!customer_id) {
      return res.status(401).json({ error: "User not logged in" });
    }

    const items = await pool.query(
      `
      SELECT
        ci.id,
        ci.product_id,          
        ci.quantity,
        ci.design_id,
        ci.sizes,
        ci.customer_note,
        p.name        AS product_name,
        p.price       AS product_price,
        p.description AS product_description,
        p.image       AS product_image,       
        d.design_data AS design_data,
        CASE 
          WHEN p.price IS NOT NULL THEN (p.price * ci.quantity)
          ELSE (50.00 * ci.quantity)
        END AS line_total
      FROM cartitem ci
      LEFT JOIN product p ON ci.product_id = p.id
      LEFT JOIN design d ON ci.design_id = d.id
      WHERE ci.customer_id = $1
      ORDER BY ci.id ASC
      `,
      [customer_id]
    );

    const normalized = items.rows.map((r) => ({
      id: r.id,
      product_id: r.product_id,
      quantity: Number(r.quantity),
      design_id: r.design_id,
      sizes: r.sizes,
      customer_note: r.customer_note,
      description: r.product_description || "Custom Sports Jersey",
      name: r.product_name || "Custom Design Jersey",
      price: r.product_price !== null ? parseFloat(r.product_price) : 1500.0,
      image: r.product_image,
      design_data: r.design_data,
      line_total: r.line_total !== null ? parseFloat(r.line_total) : 0,
    }));

    res.json(normalized);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// adding to cart
exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity, design_id, sizes, customer_note } = req.body;
    const customer_id = req.user.id;

    if (!customer_id) {
      return res.status(401).json({ error: "User not logged in" });
    }

    const item = await pool.query(
      `INSERT INTO cartitem (product_id, quantity, customer_id, design_id, sizes, customer_note)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [product_id, quantity, customer_id, design_id, sizes, customer_note]
    );

    res.status(201).json(item.rows[0]);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};
