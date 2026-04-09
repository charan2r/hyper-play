const productService = require("../services/productService");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch products",
    });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      error: error.message || "Failed to fetch product",
    });
  }
};

// Add product
exports.addProduct = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.location : null;
    const product = await productService.addProduct(req.body, imageUrl);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || "Failed to create product",
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.location : null;
    const product = await productService.updateProduct(
      req.params.id,
      req.body,
      imageUrl,
    );

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    const statusCode = error.message.includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      error: error.message || "Failed to update product",
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      error: error.message || "Failed to delete product",
    });
  }
};
