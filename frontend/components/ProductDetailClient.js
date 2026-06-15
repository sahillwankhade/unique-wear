'use client';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes && product.sizes[0] ? product.sizes[0] : 'M');
  const [qty, setQty] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  const getProductImage = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800';
    if (img.startsWith('http')) return img;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return `${apiUrl}${img}`;
  };

  const productImage = getProductImage(product.images && product.images[0] ? product.images[0] : product.image);

  const handleAddToCart = () => {
    addToCart(product, qty, selectedSize);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <Link href="/products" className="text-sm font-bold text-gray-500 hover:text-gold uppercase tracking-wider mb-8 inline-block transition">
        ← Back to Shop
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-4">
        {/* Product Image */}
        <div className="bg-gray-100 dark:bg-gray-900 overflow-hidden flex items-center justify-center border border-gray-100 dark:border-gray-900 shadow-lg h-[500px]">
          <img 
            src={productImage} 
            alt={product.name} 
            className="object-cover w-full h-full max-h-[500px]" 
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <span className="text-sm uppercase font-bold tracking-widest text-gold mb-2">
            {product.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white mb-6 uppercase tracking-tight">
            {product.name}
          </h1>
          <p className="text-2xl font-bold text-black dark:text-white mb-6">
            ₹{product.price}
          </p>
          <div className="border-t border-b border-gray-200 dark:border-gray-800 py-6 mb-8">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Description</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {product.countInStock > 0 ? (
            <>
              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Select Size</h3>
                  <div className="flex space-x-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 border font-bold text-sm flex items-center justify-center uppercase transition duration-300 cursor-pointer ${
                          selectedSize === size
                            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                            : 'border-gray-300 text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <button 
                    disabled={qty <= 1}
                    onClick={() => setQty(qty - 1)}
                    className="w-10 h-10 border border-gray-300 text-gray-600 font-bold hover:bg-gray-100 flex items-center justify-center disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-bold text-lg w-8 text-center text-black dark:text-white">{qty}</span>
                  <button 
                    disabled={qty >= product.countInStock}
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 border border-gray-300 text-gray-600 font-bold hover:bg-gray-100 flex items-center justify-center disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
                  >
                    +
                  </button>
                  <span className="text-xs text-gray-400">({product.countInStock} items in stock)</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="bg-black text-white dark:bg-white dark:text-black hover:bg-gold hover:text-black dark:hover:bg-gold dark:hover:text-black py-4 px-8 text-md font-bold uppercase tracking-widest transition duration-300 shadow-md hover:shadow-xl w-full md:w-auto cursor-pointer"
              >
                Add to Cart
              </button>

              {/* Added to Cart Success Toast Message */}
              {addedMessage && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Added to shopping cart successfully!
                </div>
              )}
            </>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded font-bold uppercase tracking-wider text-center">
              Out of Stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
