'use client';
import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cartItems, cartTotalPrice, clearCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  // Form states
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'Razorpay'

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Processing states
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login?redirect=checkout');
      }
    }
  }, [user, loading, router]);

  // Pricing calculations
  const itemsPrice = cartTotalPrice;
  const discountPrice = appliedCoupon ? Number((itemsPrice * (appliedCoupon.discount / 100)).toFixed(2)) : 0;
  const discountedSubtotal = itemsPrice - discountPrice;
  const shippingPrice = discountedSubtotal > 1000 ? 0 : 50;
  const taxPrice = Number((discountedSubtotal * 0.18).toFixed(2)); // 18% GST standard
  const totalPrice = Number((discountedSubtotal + shippingPrice + taxPrice).toFixed(2));

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 dark:bg-black">
        <div className="text-xl font-bold text-gray-500">Checking auth status...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[80vh]">
        <h1 className="text-2xl font-bold mb-6 text-white uppercase tracking-wider">Your Cart is Empty</h1>
        <p className="text-gray-400 mb-8">You must add products to your cart before checking out.</p>
        <Link href="/products" className="btn-gold px-8 py-3.5 rounded-full inline-block">
          Go to Shop
        </Link>
      </div>
    );
  }

  // Load Razorpay JS SDK dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Invalid coupon code');
      }

      setAppliedCoupon(data);
      setCouponSuccess(`Coupon applied successfully! Saved ${data.discount}%`);
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const submitOrderHandler = async (e) => {
    e.preventDefault();
    setError('');

    if (!address || !city || !postalCode || !country) {
      setError('Please fill in all shipping details');
      return;
    }

    setPlacingOrder(true);

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product,
          size: item.size,
        })),
        shippingAddress: { address, city, postalCode, country },
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      if (paymentMethod === 'COD') {
        // Submit COD Order directly to backend
        const res = await fetch(`${API_URL}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(orderData),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to place COD order');
        }

        clearCart();
        router.push(`/order-success/${data._id}`);
      } else {
        // Online Payment via Razorpay
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
        }

        // 1. Create a Razorpay Order on Backend
        const resOrder = await fetch(`${API_URL}/api/orders/create-razorpay-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ amount: totalPrice }),
        });

        const rzOrder = await resOrder.json();
        if (!resOrder.ok) {
          throw new Error(rzOrder.message || 'Razorpay order creation failed');
        }

        // 2. Open Razorpay Checkout Dialog
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1234567890',
          amount: rzOrder.amount,
          currency: rzOrder.currency,
          name: 'Unique Wear',
          description: 'E-commerce Purchase Checkout',
          order_id: rzOrder.id,
          handler: async function (response) {
            // Payment success handler - save order on backend
            try {
              const paymentDetails = {
                id: response.razorpay_payment_id,
                status: 'PAID',
                update_time: new Date().toISOString(),
                email_address: user.email,
              };

              const completeOrderData = {
                ...orderData,
                paymentResult: paymentDetails,
              };

              const resFinal = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(completeOrderData),
              });

              const dataFinal = await resFinal.json();
              if (!resFinal.ok) {
                throw new Error(dataFinal.message || 'Failed to save online paid order');
              }

              clearCart();
              router.push(`/order-success/${dataFinal._id}`);
            } catch (finalErr) {
              setError(finalErr.message || 'Error processing paid order');
              setPlacingOrder(false);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: '#C5A85A', // Gold brand color
          },
          modal: {
            ondismiss: function () {
              setPlacingOrder(false);
            },
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (err) {
      setError(err.message || 'Error processing order');
      setPlacingOrder(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl min-h-[90vh]">
      <h1 className="text-3xl font-extrabold text-white mb-10 uppercase tracking-wider text-center md:text-left">
        Checkout Checkout
      </h1>

      {error && (
        <div className="mb-8 p-4 bg-red-900/20 border border-red-900/40 text-red-400 rounded font-semibold text-sm">
          {error}
        </div>
      )}

      <form onSubmit={submitOrderHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Shipping details Form & Payment Selection */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping form block */}
          <div className="glass-panel p-8 rounded-2xl bg-[#111113]/40 border border-white/5 space-y-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              1. Shipping Address
            </h2>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Street Address *</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                placeholder="123 Street Name, Apartment, Suite"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">City *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                  placeholder="e.g. Mumbai"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Postal Code *</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                  placeholder="e.g. 400001"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Country *</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                required
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="glass-panel p-8 rounded-2xl bg-[#111113]/40 border border-white/5 space-y-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              2. Payment Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cash On Delivery (COD) */}
              <label 
                className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  paymentMethod === 'COD' 
                    ? 'border-gold bg-gold/5' 
                    : 'border-white/5 bg-black/20 hover:border-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="w-4 h-4 text-gold accent-gold rounded-full"
                  />
                  <div>
                    <span className="font-bold text-white block">Cash on Delivery</span>
                    <span className="text-xs text-gray-400">Pay when order is delivered</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-gold bg-gold/15 px-2 py-0.5 rounded-full uppercase">COD</span>
              </label>

              {/* Online payment (Razorpay) */}
              <label 
                className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  paymentMethod === 'Razorpay' 
                    ? 'border-gold bg-gold/5' 
                    : 'border-white/5 bg-black/20 hover:border-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    value="Razorpay"
                    checked={paymentMethod === 'Razorpay'}
                    onChange={() => setPaymentMethod('Razorpay')}
                    className="w-4 h-4 text-gold accent-gold rounded-full"
                  />
                  <div>
                    <span className="font-bold text-white block">Online Payment</span>
                    <span className="text-xs text-gray-400">Cards, UPI, NetBanking</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-gold bg-gold/15 px-2 py-0.5 rounded-full uppercase">Razorpay</span>
              </label>
            </div>
          </div>
        </div>

        {/* Pricing Summary Panel */}
        <div className="space-y-6">
          <div className="bg-[#111113]/40 border border-white/5 p-8 rounded-2xl shadow-md h-fit space-y-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              3. Order Summary
            </h2>

            {/* List items mini preview */}
            <div className="space-y-4 max-h-48 overflow-y-auto pr-2 divide-y divide-white/5">
              {cartItems.map((item) => (
                <div key={`${item.product}-${item.size}`} className="flex justify-between items-center text-sm pt-3 first:pt-0">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-12 bg-black/40 overflow-hidden flex-shrink-0 rounded">
                      <img src={item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`} alt={item.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-white block truncate">{item.name}</span>
                      <span className="text-xs text-gray-400 block">Size: {item.size} × {item.qty}</span>
                    </div>
                  </div>
                  <span className="font-bold text-gold pl-2 flex-shrink-0">₹{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Promo Code Coupon Input Box */}
            <div className="border-t border-white/5 pt-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Have a Coupon?</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. GOLD20"
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs focus:outline-none uppercase"
                  disabled={appliedCoupon !== null}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || appliedCoupon !== null}
                  className="bg-gold text-black px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition cursor-pointer"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </div>
              {couponError && <p className="text-xs text-red-500 font-bold mt-1.5">{couponError}</p>}
              {couponSuccess && <p className="text-xs text-green-500 font-bold mt-1.5">{couponSuccess}</p>}
            </div>

            {/* Prices calculation list */}
            <div className="space-y-3.5 border-t border-white/5 pt-4 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="font-semibold text-white">₹{itemsPrice}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-500 font-bold">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₹{discountPrice}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Shipping Fee</span>
                <span className="font-semibold text-white">
                  {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>GST Tax (18%)</span>
                <span className="font-semibold text-white">₹{taxPrice}</span>
              </div>
              <div className="flex justify-between text-lg font-extrabold text-white border-t border-white/5 pt-4">
                <span>Total Price</span>
                <span className="text-gold">₹{totalPrice}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={placingOrder}
              className="w-full btn-gold py-4 rounded-full text-sm font-extrabold uppercase tracking-widest shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {placingOrder ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
