const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const Razorpay = require('razorpay');

router.post('/create-razorpay-order', async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100, // amount in smallest currency unit (paise for INR)
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Some error occured");
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.route('/').post(protect, addOrderItems);
router.route('/:id').get(protect, getOrderById);

module.exports = router;