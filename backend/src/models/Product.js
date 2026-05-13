const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  quantity: Number,
});

module.exports = mongoose.model("Product", productSchema);