const exprees = require("express");
const {
  register,
  verify,
  reVerify,
  login,
  logout,
} = require("../controllers/userController");
const isAuthenticated = require("../middeleware/isAuthenticated");

const router = require("express").Router();

router.post("/register", register);
router.post("/verify", verify);
router.post("/reverify", reVerify);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);

module.exports = router;
