const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, price, stock } = req.body;
    if (!title || !price || !stock)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const product = await Product.create({ title, price, stock });
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
