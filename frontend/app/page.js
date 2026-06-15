import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';

async function getProducts() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${apiUrl}/api/products`, {
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

export default async function Home() {
  const products = await getProducts();
  // Get first 4 products for featured collection
  const featuredProducts = products.slice(0, 4);

  return (
    <main>
      <HeroBanner />
      <section className="py-20 bg-gray-50 dark:bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-16 tracking-wider uppercase text-black dark:text-white">Featured Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-4 text-center py-10">
                <p className="text-gray-500 text-lg">No products found. Please seed the database.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}