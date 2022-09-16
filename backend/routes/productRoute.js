const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controller/productController");
const {
  isAuthenticate,
  authorzeRoles,
} = require("../middleware/authentication");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/product/new").post(isAuthenticate, createProduct);
router
  .route("/product/:id")
  .put(isAuthenticate, authorzeRoles("admin"), updateProduct)
  .delete(isAuthenticate, authorzeRoles("admin"), deleteProduct)
  .get(getProductDetails);

module.exports = router;
