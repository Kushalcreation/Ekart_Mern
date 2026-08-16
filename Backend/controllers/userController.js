const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyEmail = require("../services/verifyEmail.js");
const Session = require("../models/sessionModel");

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All field required",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "user allready exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    await verifyEmail(token, email);
    newUser.token = token;

    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User registered sucessfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Authorization token is missing",
      });
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "The registration token is expired",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Token verification failed",
      });
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({
        success: true,
        message: "User not found",
      });
    }
    user.token = null;
    user.isverified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const reVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User not found",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    verifyEmail(token, email);
    user.token = token;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const exisitingUser = await User.findOne({ email });
    if (!exisitingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      exisitingUser.password,
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Crediential",
      });
    }

    if (exisitingUser.isverified === false) {
      return res.status(400).json({
        success: false,
        message: "Email not verified, please verify and login",
      });
    }

    const accessToken = await jwt.sign(
      { id: exisitingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "10d" },
    );

    const refreshToken = await jwt.sign(
      { id: exisitingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    exisitingUser.isLoggedIn = true;
    await exisitingUser.save();

    const exisitingSession = await Session.findOne({
      userId: exisitingUser._id,
    });
    if (exisitingSession) {
      await Session.deleteOne({ userId: exisitingUser._id });
    }

    await Session.create({ userId: exisitingUser._id });
    return res.status(200).json({
      success: true,
      message: `Welcome back ${exisitingUser.firstName}`,
      user: exisitingUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.id;

    await Session.findOneAndDelete({ userId: userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });

    return res.status(200).json({
      success: true,
      message: "User Logout Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  verify,
  reVerify,
  login,
  logout,
};
