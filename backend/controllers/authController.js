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

// Get Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const admin = await require("../repositories/userRepository").getAdminById(
      adminId,
    );

    if (!admin) {
      return res.status(404).json({
        error: "Admin not found",
      });
    }

    res.json({
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        first_name: admin.first_name,
        last_name: admin.last_name,
        phone: admin.phone,
        profile_picture: admin.profile_picture,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message || "Failed to fetch profile",
    });
  }
};
