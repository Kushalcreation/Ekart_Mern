const express = require("express");
const { isAuthenticated } = require("../middeleware/isAuthenticated");
const { createOrder, verifyPayment } = require("../controllers/orderControlle");

const router = express.Router();

router.post("/create-order", isAuthenticated, createOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);

module.exports = router;
