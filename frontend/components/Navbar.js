import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-black text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-widest uppercase text-gold">Unique Wear</Link>
        <div className="space-x-6">
          <Link href="/products" className="hover:text-gold transition">Shop</Link>
          <Link href="/categories" className="hover:text-gold transition">Categories</Link>
          <Link href="/cart" className="hover:text-gold transition">Cart</Link>
          <Link href="/login" className="hover:text-gold transition">Login</Link>
        </div>
      </div>
    </nav>
  );
}