const mongoose = require('mongoose');

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
module.exports = Product;