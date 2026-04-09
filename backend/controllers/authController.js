const authService = require("../services/authService");

// Customer Registration
exports.registerCustomer = async (req, res) => {
  try {
    const user = await authService.registerCustomer(req.body);
    const token = authService.generateToken(user, "customer");

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    const statusCode = err.message.includes("already registered") ? 400 : 500;
    res.status(statusCode).json({
      error: err.message || "Registration failed",
    });
  }
};

// Customer Login
exports.loginCustomer = async (req, res) => {
  try {
    const user = await authService.loginCustomer(
      req.body.email,
      req.body.password,
    );
    const token = authService.generateToken(user, "customer");

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(401).json({
      error: err.message || "Login failed",
    });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const admin = await authService.loginAdmin(
      req.body.email,
      req.body.password,
    );
    const token = authService.generateToken(admin, "admin");

    res.json({
      success: true,
      token,
      user: { id: admin.id, email: admin.email },
    });
  } catch (err) {
    res.status(401).json({
      error: err.message || "Login failed",
    });
  }
};

// Manufacturer Login
exports.loginManufacturer = async (req, res) => {
  try {
    const manufacturer = await authService.loginManufacturer(
      req.body.email,
      req.body.password,
    );
    const token = authService.generateToken(manufacturer, "manufacturer");

    res.json({
      success: true,
      token,
      user: { id: manufacturer.id, email: manufacturer.email },
    });
  } catch (err) {
    res.status(401).json({
      error: err.message || "Login failed",
    });
  }
};
