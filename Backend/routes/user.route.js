const exprees = require("express");
const {
  register,
  verify,
  reVerify,
  login,
  logout,
  forgotPassword,
  verifyOTP,
} = require("../controllers/userController");
const isAuthenticated = require("../middeleware/isAuthenticated");

const router = require("express").Router();

router.post("/register", register);
router.post("/verify", verify);
router.post("/reverify", reVerify);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/logout", isAuthenticated, logout);
router.post("/verify-otp/:email", verifyOTP);

module.exports = router;
