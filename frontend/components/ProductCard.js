import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white group cursor-pointer border border-gray-100 hover:shadow-2xl transition duration-300">
      <div className="relative h-80 overflow-hidden bg-gray-100">
        <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition duration-500" />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-black mb-2">{product.name}</h3>
        <p className="text-gray-500 mb-4">{product.category}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gold">$${product.price}</span>
          <button className="bg-black text-white px-4 py-2 text-sm uppercase font-bold hover:bg-gold transition">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}