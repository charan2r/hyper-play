const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Generate JWT
function generateToken(user, role) {
  return jwt.sign({ id: user.id, email: user.email, role }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

// Customer Registration
exports.registerCustomer = async (req, res) => {
  const { name, email, password, phone_number, address } = req.body;

  try {
    const exists = await pool.query("SELECT * FROM customer WHERE email=$1", [
      email,
    ]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO customer (name, email, password, phone_number, address) 
       VALUES ($1,$2,$3,$4,$5) RETURNING id,name,email`,
      [name, email, hashedPassword, phone_number, address]
    );

    const customer = result.rows[0];
    const token = generateToken(customer, "customer");

    res.json({ token, user: customer });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// Customer Login
exports.loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM customer WHERE email=$1", [
      email,
    ]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = generateToken(user, "customer");
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM admin WHERE email=$1", [
      email,
    ]);
    const admin = result.rows[0];
    if (!admin) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = generateToken(admin, "admin");
    res.json({ token, user: { id: admin.id, email: admin.email } });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// Manufacturer Login
exports.loginManufacturer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM manufacturer WHERE email=$1",
      [email]
    );
    const manufacturer = result.rows[0];
    if (!manufacturer)
      return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, manufacturer.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = generateToken(manufacturer, "manufacturer");
    res.json({
      token,
      user: { id: manufacturer.id, email: manufacturer.email },
    });
  } catch (err) {
    console.error("Manufacturer login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};
