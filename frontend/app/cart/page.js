'use client';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

export default function Cart() {
  const { cartItems, updateCartQty, removeFromCart, cartTotalPrice, clearCart } = useCart();

  return (
    <div className="container mx-auto px-4 py-16 min-h-[80vh]">
      <h1 className="text-4xl font-extrabold mb-12 text-black dark:text-white uppercase tracking-wider">
        Shopping Cart
      </h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-900">
          <p className="text-gray-500 text-lg mb-8">Your cart is currently empty.</p>
          <Link 
            href="/products" 
            className="bg-black text-white dark:bg-white dark:text-black hover:bg-gold hover:text-black dark:hover:bg-gold dark:hover:text-black py-3 px-8 font-bold uppercase tracking-wider transition"
          >
            Go Shop Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div 
                key={`${item.product}-${item.size}`}
                className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 shadow-md gap-6"
              >
                {/* Product Image & Info */}
                <div className="flex items-center space-x-6 w-full sm:w-auto">
                  <div className="w-20 h-24 bg-gray-100 dark:bg-gray-900 overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${item.image}`} 
                      alt={item.name} 
                      className="object-cover w-full h-full" 
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-black dark:text-white mb-1">{item.name}</h3>
                    <p className="text-gray-400 text-sm uppercase mb-1">Size: <span className="font-bold text-black dark:text-white">{item.size}</span></p>
                    <p className="text-gold font-bold">₹{item.price}</p>
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8">
                  <div className="flex items-center space-x-3">
                    <button 
                      disabled={item.qty <= 1}
                      onClick={() => updateCartQty(item.product, item.size, item.qty - 1)}
                      className="w-8 h-8 border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 font-bold flex items-center justify-center disabled:opacity-50 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold text-black dark:text-white w-6 text-center">{item.qty}</span>
                    <button 
                      disabled={item.qty >= item.countInStock}
                      onClick={() => updateCartQty(item.product, item.size, item.qty + 1)}
                      className="w-8 h-8 border border-gray-300 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 font-bold flex items-center justify-center disabled:opacity-50 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.product, item.size)}
                    className="text-red-500 hover:text-red-700 font-bold text-sm uppercase tracking-wider cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button 
              onClick={clearCart}
              className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm font-bold uppercase tracking-wider border-b border-gray-500 hover:border-black cursor-pointer transition"
            >
              Clear Shopping Cart
            </button>
          </div>

          {/* Cart Summary */}
          <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 p-8 shadow-md h-fit">
            <h2 className="text-2xl font-bold mb-6 text-black dark:text-white uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 pb-4">
              Order Summary
            </h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Total Items</span>
                <span className="font-bold text-black dark:text-white">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              </div>
              <div className="flex justify-between text-xl font-extrabold text-black dark:text-white border-t border-gray-200 dark:border-gray-800 pt-4">
                <span>Subtotal</span>
                <span className="text-gold">₹{cartTotalPrice}</span>
              </div>
            </div>

            <Link 
              href="/checkout" 
              className="block bg-black text-white dark:bg-white dark:text-black text-center py-4 font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition shadow-md cursor-pointer"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}