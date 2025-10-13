const express = require("express");
const router = express.Router();
const productController = require("../controllers/adminProductController");
const upload = require("../middleware/upload");

router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProductById);
router.post(
  "/products/add",
  upload.single("image"),
  productController.addProduct
);
router.put(
  "/products/:id",
  upload.single("image"),
  productController.updateProduct
);
router.delete("/products/:id", productController.deleteProduct);

module.exports = router;
