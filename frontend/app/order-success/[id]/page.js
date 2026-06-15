'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const { user, loading: loadingAuth } = useAuth();
  const params = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!loadingAuth) {
      if (!user) {
        router.push('/login');
      } else {
        const fetchOrder = async () => {
          try {
            const res = await fetch(`${API_URL}/api/orders/${params.id}`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.message || 'Failed to load order details');
            }
            setOrder(data);
          } catch (err) {
            setError(err.message || 'Error fetching order details');
          } finally {
            setLoading(false);
          }
        };
        fetchOrder();
      }
    }
  }, [user, loadingAuth, params.id, router]);

  if (loadingAuth || loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 dark:bg-black">
        <div className="text-xl font-bold text-gray-500">Retrieving order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[80vh]">
        <h1 className="text-2xl font-bold mb-6 text-red-500 uppercase tracking-wider">Error Loading Invoice</h1>
        <p className="text-gray-400 mb-8">{error || 'Order not found'}</p>
        <Link href="/products" className="btn-gold px-8 py-3.5 rounded-full inline-block">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl min-h-[90vh]">
      <div className="glass-panel p-8 md:p-12 rounded-3xl bg-[#111113]/40 border border-white/5 space-y-10 shadow-2xl relative overflow-hidden">
        {/* Success Header banner */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto border border-green-500/20 shadow-md">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-wider">Order Confirmed!</h1>
            <p className="text-gray-400 text-sm mt-1">Thank you for your purchase. Your order has been placed.</p>
          </div>
          <span className="inline-block bg-white/[0.04] text-gray-300 font-mono text-xs px-4 py-1.5 rounded-full border border-white/5">
            Order ID: {order._id}
          </span>
        </div>

        {/* Invoice Summary Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-b border-white/5 py-8">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gold mb-3">Shipping Details</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p className="font-bold text-white">{order.user?.name}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city} - {order.shippingAddress?.postalCode}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gold mb-3">Payment & Status</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Method:</span>
                <span className="font-bold text-white">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  order.isPaid ? 'bg-green-950 text-green-300' : 'bg-yellow-950 text-yellow-300'
                }`}>
                  {order.isPaid ? 'PAID' : 'PENDING'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Delivery:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  order.isDelivered ? 'bg-green-950 text-green-300' : 'bg-blue-950 text-blue-300'
                }`}>
                  {order.isDelivered ? 'DELIVERED' : 'PENDING'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items List Invoice */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gold mb-4">Items Purchased</h3>
          <div className="space-y-4 divide-y divide-white/5">
            {order.orderItems?.map((item) => {
              const imagePath = item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`;
              return (
                <div key={`${item.product}-${item.size}`} className="flex justify-between items-center text-sm pt-4 first:pt-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-14 bg-black/40 overflow-hidden flex-shrink-0 border border-white/5 rounded-lg">
                      <img src={imagePath} alt={item.name} className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">{item.name}</span>
                      <span className="text-xs text-gray-400 block">Size: {item.size} | Qty: {item.qty}</span>
                    </div>
                  </div>
                  <span className="font-bold text-gold">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Billing Total Price */}
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left text-sm text-gray-400">
            <span>Includes GST (18%) + shipping rates</span>
          </div>
          <div className="text-center md:text-right">
            <span className="text-xs text-gray-400 block uppercase tracking-widest font-bold">Grand Total</span>
            <span className="text-2xl font-black text-gold">${order.totalPrice}</span>
          </div>
        </div>

        {/* Action button */}
        <div className="text-center pt-4">
          <Link href="/products" className="btn-gold py-4 px-8 rounded-full text-xs font-bold shadow-md hover:scale-105 inline-block transition duration-300">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
