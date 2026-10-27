const express = require("express");
const { isAuthenticated } = require("../middeleware/isAuthenticated");
const {
  createOrder,
  verifyPayment,
  getMyOrder,
} = require("../controllers/orderControlle");

const router = express.Router();

router.post("/create-order", isAuthenticated, createOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);
router.get("/myorder", isAuthenticated, getMyOrder);

module.exports = router;
