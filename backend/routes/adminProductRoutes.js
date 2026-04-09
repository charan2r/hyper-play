const express = require("express");
const router = express.Router();
const productController = require("../controllers/adminProductController");
const upload = require("../utils/upload");
const validate = require("../middleware/validate");
const { verifyToken, requireRole } = require("../middleware/auth");
const {
  addProductSchema,
  updateProductSchema,
} = require("../validations/productValidation");

router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProductById);
router.post(
  "/products/add",
  verifyToken,
  requireRole("admin"),
  upload.single("image"),
  validate(addProductSchema),
  productController.addProduct,
);
router.put(
  "/products/:id",
  verifyToken,
  requireRole("admin"),
  upload.single("image"),
  validate(updateProductSchema),
  productController.updateProduct,
);
router.delete(
  "/products/:id",
  verifyToken,
  requireRole("admin"),
  productController.deleteProduct,
);

module.exports = router;
