'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddProductPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('T-Shirts');
  const [sizes, setSizes] = useState(['S', 'M', 'L', 'XL']);
  const [countInStock, setCountInStock] = useState('10');
  
  // Image states
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Submit states
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!loading) {
      if (!user || !user.isAdmin) {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || !user.isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 dark:bg-black">
        <div className="text-xl font-bold text-gray-500">Checking authorization...</div>
      </div>
    );
  }

  const handleSizeChange = (size) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    setUploadError('');

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
        // Do NOT set Content-Type header; fetch automatically sets it with boundary for FormData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Image upload failed');
      }

      setImage(data.image);
      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploadError(err.message || 'Failed to upload image');
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitSuccess(false);

    if (!name || !price || !description || !image || !category) {
      setError('Please fill in all required fields including image upload');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name,
          price: Number(price),
          description,
          image,
          category,
          sizes,
          countInStock: Number(countInStock),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Product creation failed');
      }

      setSubmitSuccess(true);
      // Reset form
      setName('');
      setPrice('');
      setDescription('');
      setImage('');
      setCountInStock('10');
      setSizes(['S', 'M', 'L', 'XL']);
    } catch (err) {
      setError(err.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl min-h-[90vh]">
      <div className="bg-white dark:bg-gray-950 p-8 md:p-10 shadow-2xl border-t-4 border-gold">
        <h1 className="text-3xl font-extrabold text-black dark:text-white uppercase tracking-wider mb-8 text-center">
          Add New Product
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded font-semibold text-sm">
            {error}
          </div>
        )}

        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded font-semibold text-sm flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Product created successfully!{' '}
            <Link href="/products" className="underline font-bold ml-1 hover:text-green-600">
              View Shop
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Product Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-black dark:text-white rounded focus:outline-none focus:border-gold"
              placeholder="e.g. Premium Cotton Tee"
              required
            />
          </div>

          {/* Row: Price & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Price (INR) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-black dark:text-white rounded focus:outline-none focus:border-gold"
                placeholder="e.g. 500"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Stock Count *</label>
              <input
                type="number"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-black dark:text-white rounded focus:outline-none focus:border-gold"
                min="0"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-black dark:text-white rounded focus:outline-none focus:border-gold h-32"
              placeholder="Describe the product details, material, fit..."
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-black dark:text-white rounded focus:outline-none focus:border-gold"
            >
              <option value="T-Shirts">T-Shirts</option>
              <option value="Outerwear">Outerwear</option>
              <option value="Bottoms">Bottoms</option>
            </select>
          </div>

          {/* Size Multi-Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Available Sizes</label>
            <div className="flex space-x-4">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <label key={size} className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                    className="w-4 h-4 text-gold accent-gold"
                  />
                  <span className="font-bold text-black dark:text-white">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Product Image *</label>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-black dark:text-white rounded focus:outline-none focus:border-gold"
                placeholder="Image URL or upload from file"
                required
              />
              <label className="bg-black text-white hover:bg-gold hover:text-black border border-black px-4 py-3 font-bold text-sm uppercase tracking-wider cursor-pointer transition flex-shrink-0">
                {uploading ? 'Uploading...' : 'Browse'}
                <input
                  type="file"
                  onChange={uploadFileHandler}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
            {uploadError && (
              <p className="mt-2 text-xs text-red-600 font-bold">{uploadError}</p>
            )}
            {image && (
              <div className="mt-4 w-32 h-40 border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                <img 
                  src={image.startsWith('http') ? image : `${API_URL}${image}`} 
                  alt="Preview" 
                  className="object-cover w-full h-full" 
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white dark:bg-white dark:text-black font-bold py-4 uppercase tracking-widest hover:bg-gold hover:text-black transition disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Creating Product...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
