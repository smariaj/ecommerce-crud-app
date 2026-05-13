const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: Array,

    totalAmount: Number,

    address: String,

    paymentMethod: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);