const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    shipping: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    // RAzorPay fields

    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
  },
  { timestamps: true },
);

export const order = mongoose.model("order", orderSchema);
