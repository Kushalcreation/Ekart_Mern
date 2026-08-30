const express = require("express");
const { isAuthenticated, isAdmin } = require("../middeleware/isAuthenticated");
const { multipleUpload } = require("../middeleware/multer");
const {
  addProduct,
  getAllProduct,
  deleteAllProduct,
  updateProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post("/add", isAuthenticated, isAdmin, multipleUpload, addProduct);
router.get("/getallproducts", getAllProduct);

router.delete("/delete/:productId", isAuthenticated, isAdmin, deleteAllProduct);

router.put(
  "/update/:productId",
  isAuthenticated,
  multipleUpload,
  isAdmin,
  updateProduct,
);

module.exports = router;
