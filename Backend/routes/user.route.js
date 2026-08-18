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
  getUserById,
  updateUser,
} = require("../controllers/userController");

const { isAuthenticated, isAdmin } = require("../middeleware/isAuthenticated");
const { singleUpload } = require("../middeleware/multer");

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
router.get("/get-user/:userId", getUserById);
router.put("/update/:id", isAuthenticated, singleUpload, updateUser);

module.exports = router;
