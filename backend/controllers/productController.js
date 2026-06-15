const Product = require('../models/Product');

const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, sizes, countInStock } = req.body;

    const product = new Product({
      name,
      price: Number(price),
      user: req.user._id,
      images: [image],
      description,
      category,
      sizes: sizes ? (Array.isArray(sizes) ? sizes : sizes.split(',').map((s) => s.trim())) : ['S', 'M', 'L', 'XL'],
      countInStock: Number(countInStock || 0),
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Product creation failed' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message || 'Product deletion failed' });
  }
};

module.exports = { getProducts, getProductById, createProduct, deleteProduct };