import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="py-20 bg-background min-h-[90vh]">
      <div className="container mx-auto px-4 max-w-7xl">
        <span className="text-gold text-xs font-extrabold uppercase tracking-[0.3em] mb-3 block text-center">
          Collections
        </span>
        <h1 className="text-4xl font-extrabold text-center mb-16 tracking-wider uppercase text-white">
          Shop By Category
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => {
            const img = cat.image.startsWith('http') ? cat.image : `${API_URL}${cat.image}`;
            return (
              <Link 
                key={cat._id || cat.name} 
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="relative h-96 group overflow-hidden block rounded-2xl border border-white/5 shadow-lg bg-[#111113]/40"
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
                  <h2 className="text-2xl font-extrabold text-white uppercase tracking-wider leading-none">
                    {cat.name}
                  </h2>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
