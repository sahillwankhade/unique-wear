'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-4 md:px-8">
      <nav className="mx-auto max-w-7xl glass-panel rounded-full px-6 py-4 flex justify-between items-center shadow-lg bg-black/60 backdrop-blur-md border border-white/5">
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="text-xl md:text-2xl font-extrabold tracking-widest uppercase text-gold-gradient hover:opacity-80 transition duration-300 flex-shrink-0"
        >
          Unique Wear
        </Link>

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative max-w-xs w-full mx-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2 rounded-full glass-input text-xs pr-10 focus:outline-none"
          />
          <button type="submit" className="absolute right-3 text-gray-400 hover:text-gold cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        {/* Links */}
        <div className="space-x-4 md:space-x-8 flex items-center font-semibold text-sm">
          <Link href="/products" className="text-gray-300 hover:text-gold transition duration-300">
            Shop
          </Link>
          <Link href="/categories" className="text-gray-300 hover:text-gold transition duration-300">
            Categories
          </Link>
          <Link 
            href="/cart" 
            className="text-gray-300 hover:text-gold transition duration-300 flex items-center"
          >
            <span>Cart</span>
            {cartItemsCount > 0 && (
              <span className="bg-gold text-black rounded-full px-2 py-0.5 text-xs font-extrabold ml-1.5 min-w-[18px] text-center shadow-md">
                {cartItemsCount}
              </span>
            )}
          </Link>

          {/* User Auth Portal */}
          {user ? (
            <div className="flex items-center space-x-3 md:space-x-4">
              <span className="text-gray-400 text-xs hidden lg:inline">Hi, {user.name}</span>
              {user.isAdmin && (
                <Link 
                  href="/admin/add-product" 
                  className="bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition duration-300"
                >
                  Dashboard
                </Link>
              )}
              <button 
                onClick={logout} 
                className="text-xs text-gray-300 hover:text-white border border-white/10 hover:border-white/30 rounded-full px-3 py-1.5 uppercase font-bold tracking-wider cursor-pointer transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="bg-gold text-black px-4 py-2 rounded-full font-bold uppercase tracking-wider text-xs hover:shadow-[0_0_15px_rgba(197,168,90,0.5)] transition duration-300"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}