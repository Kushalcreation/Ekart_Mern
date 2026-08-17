const exprees = require("express");
const {
  register,
  verify,
  reVerify,
  login,
  logout,
  forgotPassword,
  verifyOTP,
  changePassword,
  allUser,
} = require("../controllers/userController");
const { isAuthenticated, isAdmin } = require("../middeleware/isAuthenticated");

const router = require("express").Router();

router.post("/register", register);
router.post("/verify", verify);
router.post("/reverify", reVerify);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/logout", isAuthenticated, logout);
router.post("/verify-otp/:email", verifyOTP);
router.post("/change-password/:email", changePassword);

router.get("/all-user", isAuthenticated, isAdmin, allUser);

module.exports = router;
