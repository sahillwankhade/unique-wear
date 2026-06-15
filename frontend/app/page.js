import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function getProducts() {
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fallback default categories
    return [
      { name: 'Male', image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=800' },
      { name: 'Female', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800' },
      { name: 'Oversized', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800' },
      { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800' }
    ];
  }
}

export default async function Home() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  
  // Get first 4 products for featured collection
  const featuredProducts = products.slice(0, 4);

  return (
    <main className="bg-background min-h-screen">
      <HeroBanner />

      {/* Shop By Category Section */}
      <section className="py-20 bg-background border-b border-white/5">
        <div className="container mx-auto px-4 max-w-7xl">
          <span className="text-gold text-xs font-extrabold uppercase tracking-[0.3em] mb-3 block text-center">
            Curated Styles
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white mb-16 uppercase tracking-wider">
            Shop By Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat) => {
              const img = cat.image.startsWith('http') ? cat.image : `${API_URL}${cat.image}`;
              return (
                <Link
                  key={cat._id || cat.name}
                  href={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="relative h-96 group overflow-hidden block rounded-2xl border border-white/5 shadow-md bg-[#111113]/40"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <span className="text-gold text-xs font-bold uppercase tracking-widest mb-1.5 block opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      Explore Collection →
                    </span>
                    <h3 className="text-2xl font-extrabold text-white uppercase tracking-wider leading-none">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <span className="text-gold text-xs font-extrabold uppercase tracking-[0.3em] mb-3 block text-center">
            Exclusive Pieces
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-white mb-16 uppercase tracking-wider">
            Featured Collection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-4 text-center py-20">
                <p className="text-gray-500 text-lg">No products found. Please seed the database.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}