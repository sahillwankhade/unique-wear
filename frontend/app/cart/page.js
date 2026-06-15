'use client';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

export default function Cart() {
  const { cartItems, updateCartQty, removeFromCart, cartTotalPrice, clearCart } = useCart();

  return (
    <div className="container mx-auto px-4 py-16 min-h-[80vh]">
      <h1 className="text-4xl font-extrabold mb-12 text-white uppercase tracking-wider">
        Shopping Cart
      </h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-black/20 border border-white/5 rounded-2xl glass-panel">
          <p className="text-gray-500 text-lg mb-8">Your cart is currently empty.</p>
          <Link 
            href="/products" 
            className="btn-gold py-3.5 px-8 rounded-full font-bold uppercase tracking-wider transition shadow-md inline-block"
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
                className="flex flex-col sm:flex-row items-center justify-between p-6 bg-[#111113]/40 border border-white/5 rounded-2xl shadow-md gap-6 glass-panel"
              >
                {/* Product Image & Info */}
                <div className="flex items-center space-x-6 w-full sm:w-auto">
                  <div className="w-20 h-24 bg-black/40 border border-white/5 overflow-hidden flex-shrink-0 rounded-lg">
                    <img 
                      src={item.image.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${item.image}`} 
                      alt={item.name} 
                      className="object-cover w-full h-full" 
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white mb-1">{item.name}</h3>
                    <p className="text-gray-400 text-sm uppercase mb-1">Size: <span className="font-bold text-white">{item.size}</span></p>
                    <p className="text-gold font-bold">₹{item.price}</p>
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8">
                  <div className="flex items-center space-x-3">
                    <button 
                      disabled={item.qty <= 1}
                      onClick={() => updateCartQty(item.product, item.size, item.qty - 1)}
                      className="w-8 h-8 border border-white/10 text-gray-400 hover:border-gold hover:text-gold hover:bg-white/5 font-bold flex items-center justify-center disabled:opacity-30 cursor-pointer rounded-lg transition"
                    >
                      -
                    </button>
                    <span className="font-bold text-white w-6 text-center">{item.qty}</span>
                    <button 
                      disabled={item.qty >= item.countInStock}
                      onClick={() => updateCartQty(item.product, item.size, item.qty + 1)}
                      className="w-8 h-8 border border-white/10 text-gray-400 hover:border-gold hover:text-gold hover:bg-white/5 font-bold flex items-center justify-center disabled:opacity-30 cursor-pointer rounded-lg transition"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.product, item.size)}
                    className="text-red-500 hover:text-red-400 font-bold text-sm uppercase tracking-wider cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button 
              onClick={clearCart}
              className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-wider border-b border-gray-500 cursor-pointer transition"
            >
              Clear Shopping Cart
            </button>
          </div>

          {/* Cart Summary */}
          <div className="bg-[#111113]/40 border border-white/5 p-8 shadow-md h-fit rounded-2xl glass-panel">
            <h2 className="text-2xl font-bold mb-6 text-white uppercase tracking-wider border-b border-white/5 pb-4">
              Order Summary
            </h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-400">
                <span>Total Items</span>
                <span className="font-bold text-white">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              </div>
              <div className="flex justify-between text-xl font-extrabold text-white border-t border-white/5 pt-4">
                <span>Subtotal</span>
                <span className="text-gold">₹{cartTotalPrice}</span>
              </div>
            </div>

            <Link 
              href="/checkout" 
              className="block btn-gold text-center py-4 rounded-full font-bold uppercase tracking-widest transition shadow-md cursor-pointer"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}