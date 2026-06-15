import ProductDetailClient from '../../../components/ProductDetailClient';
import Link from 'next/link';

async function getProduct(id) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${apiUrl}/api/products/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch product');
    }
    return await res.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold mb-4 text-black dark:text-white">Product Not Found</h1>
        <p className="text-gray-500 mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link 
          href="/products" 
          className="bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white px-6 py-3 font-bold uppercase tracking-wider hover:bg-gold hover:text-black hover:border-gold transition"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
