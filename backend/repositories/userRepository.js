const pool = require("../config/db");

class UserRepository {
  async findByEmail(email, userType = "customer") {
    const table =
      userType === "admin"
        ? "admin"
        : userType === "manufacturer"
          ? "manufacturer"
          : "customer";
    const result = await pool.query(`SELECT * FROM ${table} WHERE email = $1`, [
      email,
    ]);
    return result.rows[0];
  }

  async findById(id, userType = "customer") {
    const table =
      userType === "admin"
        ? "admin"
        : userType === "manufacturer"
          ? "manufacturer"
          : "customer";
    const result = await pool.query(
      `SELECT id, name, email FROM ${table} WHERE id = $1`,
      [id],
    );
    return result.rows[0];
  }

  async createCustomer(userData) {
    const { name, email, hashedPassword, phone_number, address } = userData;
    const result = await pool.query(
      `INSERT INTO customer (name, email, password, phone_number, address) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email`,
      [name, email, hashedPassword, phone_number, address],
    );
    return result.rows[0];
  }

  async createAdmin(userData) {
    const { email, hashedPassword } = userData;
    const result = await pool.query(
      `INSERT INTO admin (email, password) 
       VALUES ($1, $2) 
       RETURNING id, email`,
      [email, hashedPassword],
    );
    return result.rows[0];
  }

  async createManufacturer(userData) {
    const { email, hashedPassword } = userData;
    const result = await pool.query(
      `INSERT INTO manufacturer (email, password) 
       VALUES ($1, $2) 
       RETURNING id, email`,
      [email, hashedPassword],
    );
    return result.rows[0];
  }

  async getPassword(email, userType = "customer") {
    const table =
      userType === "admin"
        ? "admin"
        : userType === "manufacturer"
          ? "manufacturer"
          : "customer";
    const result = await pool.query(
      `SELECT password FROM ${table} WHERE email = $1`,
      [email],
    );
    return result.rows[0]?.password;
  }

  async getUserWithPassword(email, userType = "customer") {
    const table =
      userType === "admin"
        ? "admin"
        : userType === "manufacturer"
          ? "manufacturer"
          : "customer";
    const result = await pool.query(`SELECT * FROM ${table} WHERE email = $1`, [
      email,
    ]);
    return result.rows[0];
  }

  async getActiveManufacturers() {
    const result = await pool.query(
      "SELECT id, name, email, phone FROM manufacturer WHERE status = 'active' ORDER BY name",
    );
    return result.rows;
  }

  async getManufacturerById(manufacturerId) {
    const result = await pool.query(
      "SELECT id, name FROM manufacturer WHERE id = $1",
      [manufacturerId],
    );
    return result.rows[0];
  }

  async getAdminById(adminId) {
    const result = await pool.query(
      "SELECT id, email, first_name, last_name, phone, profile_picture FROM admin WHERE id = $1",
      [adminId],
    );
    return result.rows[0];
  }
}

module.exports = new UserRepository();
