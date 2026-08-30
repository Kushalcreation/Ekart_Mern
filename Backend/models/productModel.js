const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    productName: { type: String, required: true },
    productDesc: { type: String, required: true },

    productImg: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    productPrice: {
      type: Number,
    },
    category: { type: String },
    brand: { type: String },
  },
  { timestamps: true },
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
