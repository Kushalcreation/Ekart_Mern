const exprees = require("express");
const { register, verify, reVerify } = require("../controllers/userController");

const router = require("express").Router();

router.post("/register", register);
router.post("/verify", verify);
router.post("/reverify", reVerify);

module.exports = router;
