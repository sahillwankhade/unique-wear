import HeroBanner from '../components/HeroBanner';
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
}