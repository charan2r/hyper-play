const pool = require("../db");

exports.getAllProducts = async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT * FROM product ORDER BY created_date DESC"
    );
    res.json(results.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM product WHERE id = $1", [
      id,
    ]);
    if (result.rows.length == 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.addProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    sport,
    status = "active",
    stock = 0,
  } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const product = await pool.query(
      `INSERT INTO product (name, description, price, category, sport, status, stock, image)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [name, description, price, category, sport, status, stock, image]
    );
    res.status(201).json(product.rows[0]);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, sport, status, stock } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    let query, params;
    if (image) {
      query = `UPDATE product SET
               name=$1, description=$2, price=$3, category=$4, sport=$5, status=$6,
               stock=$7, image=$8
               WHERE id=$9 RETURNING *`;
      params = [
        name,
        description,
        price,
        category,
        sport,
        status,
        stock,
        image,
        id,
      ];
    } else {
      query = `UPDATE product SET
               name=$1, description=$2, price=$3, category=$4, sport=$5, status=$6,
               stock=$7
               WHERE id=$8 RETURNING *`;
      params = [name, description, price, category, sport, status, stock, id];
    }

    const result = await pool.query(query, params);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Product not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
};
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM product WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
