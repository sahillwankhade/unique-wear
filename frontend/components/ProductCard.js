'use client';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const router = useRouter();

  const getProductImage = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800';
    if (img.startsWith('http')) return img;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return `${apiUrl}${img}`;
  };

  const productImage = getProductImage(product.images && product.images[0] ? product.images[0] : product.image);

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
      className="glass-panel glass-panel-hover group cursor-pointer rounded-2xl overflow-hidden flex flex-col justify-between h-full bg-[#111113]/40 border border-white/5 shadow-md"
    >
      {/* Product Image Box */}
      <div className="relative h-80 overflow-hidden bg-black/40 flex items-center justify-center border-b border-white/5">
        <img 
          src={productImage} 
          alt={product.name} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out" 
        />
        {product.discount > 0 && (
          <span className="absolute top-4 right-4 bg-red-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* Info details */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-gold mb-1.5 block opacity-85">
            {product.category}
          </span>
          <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-gold transition duration-300">
            {product.name}
          </h3>
        </div>
        <div className="flex justify-between items-center mt-6">
          <span className="text-xl font-black text-white">₹{product.price}</span>
          <button 
            onClick={handleAddToCart}
            className="bg-gold text-black hover:bg-white hover:text-black font-extrabold text-xs px-4 py-2.5 rounded-full uppercase tracking-wider transition-all duration-300 shadow-[0_4px_12px_rgba(197,168,90,0.15)] hover:shadow-[0_4px_20px_rgba(255,255,255,0.2)] cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}