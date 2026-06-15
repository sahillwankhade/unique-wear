import Link from 'next/link';

export default function CategoriesPage() {
  const categories = [
    { name: 'Outerwear', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800' },
    { name: 'T-Shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800' },
    { name: 'Bottoms', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800' },
  ];

  return (
    <main className="py-12 bg-gray-50 dark:bg-black min-h-[90vh]">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-12 tracking-wider uppercase text-black dark:text-white">
          Shop By Category
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              href={`/products?category=${cat.name}`}
              className="relative h-80 group overflow-hidden block border border-gray-200 dark:border-gray-800 shadow-md"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300 flex items-center justify-center">
                <h2 className="text-3xl font-extrabold text-white uppercase tracking-widest border-2 border-white px-6 py-3">
                  {cat.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
