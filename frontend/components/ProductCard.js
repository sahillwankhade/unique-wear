'use client';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const router = useRouter();

  const productImage = product.images && product.images[0] ? product.images[0] : product.image;

  const handleCardClick = () => {
    router.push(`/products/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // prevent navigating to detail page
    addToCart(product, 1, 'M'); // Add default size 'M' and quantity 1
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-950 group cursor-pointer border border-gray-100 dark:border-gray-900 hover:shadow-2xl transition duration-300 flex flex-col justify-between h-full"
    >
      <div className="relative h-80 overflow-hidden bg-gray-100 dark:bg-gray-900">
        <img 
          src={productImage} 
          alt={product.name} 
          className="object-cover w-full h-full group-hover:scale-105 transition duration-500" 
        />
      </div>
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-black dark:text-white mb-2">{product.name}</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">{product.category}</p>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xl font-bold text-gold">${product.price}</span>
          <button 
            onClick={handleAddToCart}
            className="bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white px-4 py-2 text-sm uppercase font-bold hover:bg-gold hover:text-black hover:border-gold transition cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}