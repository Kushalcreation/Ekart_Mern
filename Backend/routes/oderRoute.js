const express = require("express");
const { isAuthenticated, isAdmin } = require("../middeleware/isAuthenticated");
const {
  createOrder,
  verifyPayment,
  getMyOrder,
  getAllOrdersAdmin,
  getUserOrder,
} = require("../controllers/orderControlle");

const router = express.Router();

router.post("/create-order", isAuthenticated, createOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);
router.get("/myorder", isAuthenticated, getMyOrder);
router.get("/all", isAuthenticated, isAdmin, getAllOrdersAdmin);
router.get("/user-order/:userId", isAuthenticated, isAdmin, getUserOrder);

module.exports = router;
