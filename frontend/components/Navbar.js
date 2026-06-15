'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItemsCount } = useCart();

  return (
    <nav className="bg-black text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-widest uppercase text-gold hover:opacity-85 transition">
          Unique Wear
        </Link>
        <div className="space-x-6 flex items-center">
          <Link href="/products" className="hover:text-gold transition">Shop</Link>
          <Link href="/cart" className="hover:text-gold transition flex items-center">
            Cart
            {cartItemsCount > 0 && (
              <span className="bg-gold text-black rounded-full px-2 py-0.5 text-xs font-bold ml-1.5 min-w-[20px] text-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm hidden sm:inline">Hi, {user.name}</span>
              <button 
                onClick={logout} 
                className="hover:bg-gold hover:text-black border border-gold rounded px-3 py-1 text-sm font-bold tracking-wider cursor-pointer uppercase transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="hover:text-gold transition">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}