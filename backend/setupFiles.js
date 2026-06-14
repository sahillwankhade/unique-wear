const fs = require('fs');
const path = require('path');

const files = {
  'models/Product.js': `const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true });

const productSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  images: [{ type: String, required: true }],
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  discount: { type: Number, required: true, default: 0 },
  sizes: [{ type: String }],
  countInStock: { type: Number, required: true, default: 0 },
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;`,

  'models/Order.js': `const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  orderItems: [{
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    size: { type: String }
  }],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String },
  },
  taxPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: { type: Date },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;`,

  'middleware/authMiddleware.js': `const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };`,

  'utils/generateToken.js': `const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
module.exports = generateToken;`,

  'controllers/userController.js': `const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });
  const user = await User.create({ name, email, password });
  if (user) {
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: generateToken(user._id) });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { authUser, registerUser, getUserProfile };`,

  'controllers/productController.js': `const Product = require('../models/Product');

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

module.exports = { getProducts, getProductById };`,

  'routes/userRoutes.js': `const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);

module.exports = router;`,

  'routes/productRoutes.js': `const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require('../controllers/productController');

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

module.exports = router;`,

  'routes/orderRoutes.js': `const express = require('express');
const router = express.Router();

router.route('/').post((req, res) => res.json({ message: 'Create order not fully implemented' }));

module.exports = router;`,

  'routes/uploadRoutes.js': `const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.send('Upload route placeholder');
});

module.exports = router;`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Backend files generated successfully.');
