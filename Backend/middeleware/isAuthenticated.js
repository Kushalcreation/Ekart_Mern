const User = require("../models/userModel");
const { TokenExpiredError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization token is missing or Invalid",
      });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (Error.name === TokenExpiredError) {
        return res.status(400).json({
          success: false,
          message: "the registration token is expired",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Access token is missing or Invalid",
      });
    }

    const user = User.findById(decoded.id);
    if (!user)
      return res.status(400).json({
        success: false,
        message: "User not found",
      });

    req.id = user._id;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = isAuthenticated;
