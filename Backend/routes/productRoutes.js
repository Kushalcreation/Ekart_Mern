const express = require("express");
const { isAuthenticated, isAdmin } = require("../middeleware/isAuthenticated");
const { multipleUpload } = require("../middeleware/multer");
const {
  addProduct,
  getAllProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post("/add", isAuthenticated, isAdmin, multipleUpload, addProduct);
router.get("/getallproducts", getAllProduct);

module.exports = router;
