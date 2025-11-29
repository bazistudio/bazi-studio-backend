const Order = require("../models/Order");

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId items.productId");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { userId, items, total } = req.body;
    if (!userId || !items || !total)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const order = await Order.create({ userId, items, total });
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
