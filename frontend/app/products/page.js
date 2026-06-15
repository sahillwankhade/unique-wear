import ProductCard from '../../components/ProductCard';

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

export default async function ProductsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams?.category;
  const products = await getProducts();

  const filteredProducts = category
    ? products.filter((p) => p.category?.toLowerCase() === category.toLowerCase())
    : products;

  return (
    <main className="py-12 bg-gray-50 dark:bg-black min-h-[90vh]">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-12 tracking-wider uppercase text-black dark:text-white">
          {category ? `${category} Collection` : 'All Products'}
        </h1>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
