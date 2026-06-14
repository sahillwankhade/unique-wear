const fs = require('fs');
const path = require('path');

const files = {
  'components/Navbar.js': `import Link from 'next/link';

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
}`,

  'components/HeroBanner.js': `import Link from 'next/link';

export default function HeroBanner() {
  return (
    <div className="relative bg-black h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070')] bg-cover bg-center"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">ELEVATE YOUR STYLE</h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">Discover the premium collection of modern fashion. Designed for the unique you.</p>
        <Link href="/products" className="bg-gold text-black px-8 py-4 text-lg font-bold uppercase tracking-widest hover:bg-gold-light transition">Shop Collection</Link>
      </div>
    </div>
  );
}`,

  'components/ProductCard.js': `import Link from 'next/link';

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
          <span className="text-xl font-bold text-gold">$\${product.price}</span>
          <button className="bg-black text-white px-4 py-2 text-sm uppercase font-bold hover:bg-gold transition">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}`,

  'app/page.js': `import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';

const featuredProducts = [
  { _id: '1', name: 'Premium Black Hoodie', category: 'Outerwear', price: 89.99, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800' },
  { _id: '2', name: 'Minimalist White Tee', category: 'T-Shirts', price: 34.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800' },
  { _id: '3', name: 'Gold Accent Jacket', category: 'Outerwear', price: 129.99, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800' },
  { _id: '4', name: 'Urban Cargo Pants', category: 'Bottoms', price: 79.99, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800' },
];

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <section className="py-20 bg-gray-50 dark:bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-16 tracking-wider uppercase text-black dark:text-white">Featured Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}`,

  'app/layout.js': `import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Unique Wear | Premium Modern Fashion',
  description: 'Shop the latest premium fashion at Unique Wear.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}`,

  'app/cart/page.js': `export default function Cart() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-extrabold mb-10 text-black dark:text-white">Shopping Cart</h1>
      <p className="text-gray-500">Your cart is currently empty.</p>
    </div>
  );
}`,

  'app/login/page.js': `export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gray-50 dark:bg-black">
      <div className="bg-white dark:bg-gray-900 p-10 shadow-2xl w-full max-w-md border-t-4 border-gold">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-black dark:text-white uppercase tracking-wider">Login</h2>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input type="email" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded focus:outline-none focus:border-gold transition" placeholder="Enter email" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input type="password" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded focus:outline-none focus:border-gold transition" placeholder="Enter password" />
          </div>
          <button type="submit" className="w-full bg-black text-white font-bold py-3 uppercase tracking-widest hover:bg-gold transition">Sign In</button>
        </form>
      </div>
    </div>
  );
}`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Frontend files generated successfully.');
