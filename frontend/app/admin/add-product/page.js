'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Navigation state
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'add'

  // Product listing states
  const [productsList, setProductsList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
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

  // Fetch all products for the listing tab
  const fetchProducts = async () => {
    setLoadingProducts(true);
    setProductsError('');
    try {
      const res = await fetch(`${API_URL}/api/products`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch products');
      }
      setProductsList(data);
    } catch (err) {
      setProductsError(err.message || 'Error loading products');
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user || !user.isAdmin) {
        router.push('/login');
      } else {
        fetchProducts();
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

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete product');
      }

      // Remove from state list
      setProductsList(productsList.filter((p) => p._id !== productId));
      alert('Product deleted successfully');
    } catch (err) {
      alert(err.message || 'Error deleting product');
    }
  };

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
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Image upload failed');
      }

      setImage(data.image);
      setUploading(false);
    } catch (err) {
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
      // Refresh list
      fetchProducts();
      // Switch back to list tab
      setTimeout(() => {
        setActiveTab('list');
        setSubmitSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter products by search
  const filteredProducts = productsList.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl min-h-[90vh]">
      {/* Dashboard Title & Tabs Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-white/10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage store products, stock levels, and media</p>
        </div>
        <div className="flex space-x-2 bg-black/40 p-1.5 rounded-full border border-white/5">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === 'list'
                ? 'bg-gold text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Manage Products
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === 'add'
                ? 'bg-gold text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Tab Content: Manage Products List */}
      {activeTab === 'list' && (
        <div className="glass-panel p-8 rounded-2xl bg-[#111113]/40 border border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Product Inventory</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name..."
              className="px-4 py-2.5 rounded-full glass-input text-sm w-full md:w-80 focus:outline-none"
            />
          </div>

          {loadingProducts ? (
            <div className="text-center py-20 text-gray-500 font-bold text-sm">
              Loading inventory products...
            </div>
          ) : productsError ? (
            <div className="text-center py-20 text-red-500 font-bold text-sm">
              {productsError}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-sm">
              No products found matching "{searchQuery}"
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider text-xs">
                    <th className="pb-4">Product</th>
                    <th className="pb-4">Category</th>
                    <th className="pb-4">Price</th>
                    <th className="pb-4">Stock</th>
                    <th className="pb-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProducts.map((p) => {
                    const img = p.images && p.images[0] ? p.images[0] : p.image;
                    const resolvedImg = img && img.startsWith('http') ? img : `${API_URL}${img}`;
                    return (
                      <tr key={p._id} className="hover:bg-white/[0.02] transition duration-200">
                        <td className="py-4 flex items-center space-x-4">
                          <div className="w-12 h-14 bg-black/40 overflow-hidden flex-shrink-0 border border-white/10">
                            <img src={resolvedImg} alt={p.name} className="object-cover w-full h-full" />
                          </div>
                          <div>
                            <span className="font-bold text-white block">{p.name}</span>
                            <span className="text-xs text-gray-500 block truncate max-w-xs">{p.description}</span>
                          </div>
                        </td>
                        <td className="py-4 text-gray-300 font-semibold">{p.category}</td>
                        <td className="py-4 text-gold font-bold">${p.price}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            p.countInStock > 0 ? 'bg-green-950 text-green-300' : 'bg-red-950 text-red-300'
                          }`}>
                            {p.countInStock} Left
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="bg-red-600/10 hover:bg-red-600 hover:text-white border border-red-600/20 text-red-500 text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Add Product Form */}
      {activeTab === 'add' && (
        <div className="glass-panel p-8 md:p-10 rounded-2xl bg-[#111113]/40 border border-white/5 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-8 text-center border-b border-white/5 pb-4">
            Upload Product Listing
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-900/40 text-red-400 rounded font-semibold text-sm">
              {error}
            </div>
          )}

          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-900/40 text-green-400 rounded font-semibold text-sm">
              Product listing added successfully! Returning to inventory...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                placeholder="e.g. Premium Cotton Tee"
                required
              />
            </div>

            {/* Row: Price & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Price (INR) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                  placeholder="e.g. 500"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Stock Count *</label>
                <input
                  type="number"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm h-32"
                placeholder="Describe product materials, fit, dimensions..."
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm cursor-pointer"
              >
                <option value="T-Shirts">T-Shirts</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Bottoms">Bottoms</option>
              </select>
            </div>

            {/* Sizes checkboxes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Available Sizes</label>
              <div className="flex space-x-6">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <label key={size} className="inline-flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sizes.includes(size)}
                      onChange={() => handleSizeChange(size)}
                      className="w-4 h-4 text-gold accent-gold rounded focus:ring-0"
                    />
                    <span className="font-bold text-white text-sm">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Image Explorer File Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Product Image *</label>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="flex-grow px-4 py-3 rounded-xl glass-input text-sm"
                  placeholder="Image URL path or upload below"
                  required
                />
                <label className="bg-gold text-black font-extrabold text-xs px-5 py-3 rounded-xl uppercase tracking-wider hover:opacity-95 cursor-pointer transition duration-300">
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
                <p className="mt-2 text-xs text-red-500 font-bold">{uploadError}</p>
              )}
              {image && (
                <div className="mt-4 w-32 h-40 border border-white/10 overflow-hidden bg-black/40 flex items-center justify-center rounded-xl">
                  <img 
                    src={image.startsWith('http') ? image : `${API_URL}${image}`} 
                    alt="Preview" 
                    className="object-cover w-full h-full" 
                  />
                </div>
              )}
            </div>

            {/* Submit btn */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-gold py-4 rounded-full text-sm font-extrabold uppercase tracking-widest shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Creating listing...' : 'Create Listing'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
