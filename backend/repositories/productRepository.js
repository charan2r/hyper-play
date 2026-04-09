const pool = require("../db");

class ProductRepository {
  async getAll() {
    const result = await pool.query(
      "SELECT * FROM product ORDER BY created_date DESC",
    );
    return result.rows;
  }

  async getById(id) {
    const result = await pool.query("SELECT * FROM product WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  }

  async getActiveProducts() {
    const result = await pool.query(
      "SELECT * FROM product WHERE LOWER(status) = 'active' ORDER BY created_date DESC",
    );
    return result.rows;
  }

  async create(productData) {
    const { name, description, price, category, sport, status, stock, image } =
      productData;
    const result = await pool.query(
      `INSERT INTO product (name, description, price, category, sport, status, stock, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, description, price, category, sport, status, stock, image],
    );
    return result.rows[0];
  }

  async update(id, productData) {
    const { name, description, price, category, sport, status, stock, image } =
      productData;

    let query, params;
    if (image) {
      query = `UPDATE product SET
               name=$1, description=$2, price=$3, category=$4, sport=$5, status=$6, stock=$7, image=$8
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
               name=$1, description=$2, price=$3, category=$4, sport=$5, status=$6, stock=$7
               WHERE id=$8 RETURNING *`;
      params = [name, description, price, category, sport, status, stock, id];
    }

    const result = await pool.query(query, params);
    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query(
      "DELETE FROM product WHERE id = $1 RETURNING id",
      [id],
    );
    return result.rows[0];
  }

  async getPriceById(id) {
    const result = await pool.query("SELECT price FROM product WHERE id = $1", [
      id,
    ]);
    return result.rows[0]?.price;
  }
}

module.exports = new ProductRepository();
