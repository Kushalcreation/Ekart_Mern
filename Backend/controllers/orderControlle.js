const razorpayInstance = require("../config/razorpay.js");
const { Order } = require("../models/orderModel.js");
const crypto = require("crypto");
const Cart = require("../models/cartModel.js");
const User = require("../models/userModel.js");
const Product = require("../models/productModel.js");

const createOrder = async (req, res) => {
  try {
    const { products, amount, tax, shipping, currency } = req.body;
    const options = {
      amount: Math.round(Number(amount) * 100), //convert to paise
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    //save order in db
    const newOrder = new Order({
      user: req.user._id,
      products,
      amount,
      tax,
      shipping,
      currency,
      status: "Pending",
      razorpayOrderId: razorpayOrder.id,
    });

    await newOrder.save();

    res.json({
      success: true,
      order: razorpayOrder,
      dbOrder: newOrder,
    });
  } catch (error) {
    console.error("Error in create order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentFailed,
    } = req.body;
    const userId = req.user._id;

    // Do not make an order failed just because checkout is dismissed.

    if (paymentFailed) {
      return res.status(400).json({
        success: false,
        message: "Payment failure must be verified seperately",
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details",
      });
    }

    // find order belonging to the user
    const existingOrder = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      user: userId,
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    if (existingOrder.status === "Paid") {
      return res.json({
        success: true,
        message: "Payment already verified",
        order: existingOrder,
      });
    }

    // IMPORTANT: Razorpay requires a pipe between the two IDs
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    console.log(
      "Razorpay signature matches:",
      expectedSignature === razorpay_signature,
    );

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const order = await Order.findOneAndUpdate(
      {
        razorpayOrderId: razorpay_order_id,
        user: userId,
        status: "Pending",
      },
      {
        status: "Paid",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      { returnDocument: "after" },
    );

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Order could not be updated",
      });
    }

    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [], totalPrice: 0 } },
    );

    return res.json({
      success: true,
      message: "Payment successful",
      order,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyOrder = async (req, res) => {
  try {
    const userId = req.id;
    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImg",
      })
      .populate("user", "firstName lastName email");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders", error);
    res.status(500).json({ message: error.message });
  }
};

// Admin only
const getUserOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImg",
      }) // fetch product details
      .populate("user", "firstName lastName email"); // fetch user info
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.log("Error fetching user Order", error);
    res.status(500).json({ message: error.message });
  }
};

const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email") // fetch user info
      .populate("products.productId", "productName productPrice"); // fetch product info

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
};

const getSalesData = async (req, res) => {
  try {
    const totalUser = await User.countDocument({});
    const totalProducts = await Product.countDocument({});
    const totalOrders = await Order.countDocument({ status: "Paid" });

    // Total Sales Amount
    const totalSaleAgg = await Order.aggregate([
      { $match: { status: "Paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalSales = totalSaleAgg[0]?.total || 0;

    // sales grouped by date(last 30 days)

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesByDate = await Order.aggregate([
      { $match: { status: "Paid", createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%y-%m-%d", date: $createdAt },
          },
          amount: { $sum: "$amount" },
        },
      },
      { sort: { _id: 1 } },
    ]);

    const formattedSales = salesByDate.map((item) => ({
      date: item._id,
      amount: item.amount,
    }));
    console.lof(formattedSales);

    res.json({
      success: true,
      totalUsers,
      totalProducts,
      totalOrders,
      totalSales,
      sales: formattedSales,
    });
  } catch (error) {
    console.error("Erroe fetching sales date", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getMyOrder,
  getUserOrder,
  getAllOrdersAdmin,
  getSalesData,
};
