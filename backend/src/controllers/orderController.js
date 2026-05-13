const Order = require("../models/Order");
const Product = require("../models/Product");


// PLACE ORDER
const placeOrder = async (req, res) => {
  try {
    const { products, totalAmount, address, paymentMethod } = req.body;


    // reduce product quantity
    for (const item of products) {
      const product = await Product.findById(item._id);

      if (product.quantity < item.cartQuantity) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

      product.quantity =
        product.quantity - item.cartQuantity;

      await product.save();
    }


    // save order
    const order = await Order.create({
      products,
      totalAmount,
      address,
      paymentMethod,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  placeOrder,
};