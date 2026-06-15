'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Navigation state
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'add', 'categories', 'offers'

  // Dynamic Lists states
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [couponsList, setCouponsList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Add / Edit Product States
  const [editingProduct, setEditingProduct] = useState(null); // holds product object if editing
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [sizes, setSizes] = useState(['S', 'M', 'L', 'XL']);
  const [countInStock, setCountInStock] = useState('10');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  // 2. Category Management States
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [catUploading, setCatUploading] = useState(false);
  const [catUploadError, setCatUploadError] = useState('');
  const [catSubmitting, setCatSubmitting] = useState(false);
  const [catError, setCatError] = useState('');
  const [catSuccess, setCatSuccess] = useState('');

  // 3. Coupon/Offer Management States
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [couponSubmitting, setCouponSubmitting] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Fetch functions
  const fetchProducts = async () => {
    setLoadingProducts(true);
    setProductsError('');
    try {
      const res = await fetch(`${API_URL}/api/products`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch products');
      setProductsList(data);
    } catch (err) {
      setProductsError(err.message || 'Error loading products');
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch categories');
      setCategoriesList(data);
      if (data.length > 0 && !category) {
        setCategory(data[0].name); // set first category as default in dropdown
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchCoupons = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/api/coupons`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch coupons');
      setCouponsList(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user || !user.isAdmin) {
        router.push('/login');
      } else {
        fetchProducts();
        fetchCategories();
        fetchCoupons();
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

  // --- PRODUCT MANAGEMENT ACTIONS ---

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
      if (!res.ok) throw new Error(data.message || 'Failed to delete product');
      setProductsList(productsList.filter((p) => p._id !== productId));
      alert('Product deleted successfully');
    } catch (err) {
      alert(err.message || 'Error deleting product');
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setDescription(product.description);
    setCategory(product.category);
    setSizes(product.sizes || []);
    setCountInStock(product.countInStock.toString());
    setImage(product.images && product.images[0] ? product.images[0] : product.image || '');
    setActiveTab('add'); // switch to form tab
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setDescription('');
    if (categoriesList.length > 0) {
      setCategory(categoriesList[0].name);
    }
    setCountInStock('10');
    setSizes(['S', 'M', 'L', 'XL']);
    setImage('');
    setActiveTab('list');
  };

  const uploadFileHandler = async (e, type = 'product') => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    if (type === 'product') {
      setUploading(true);
      setUploadError('');
    } else {
      setCatUploading(true);
      setCatUploadError('');
    }

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Image upload failed');

      if (type === 'product') {
        setImage(data.image);
      } else {
        setNewCatImage(data.image);
      }
    } catch (err) {
      if (type === 'product') {
        setUploadError(err.message || 'Failed to upload image');
      } else {
        setCatUploadError(err.message || 'Failed to upload image');
      }
    } finally {
      setUploading(false);
      setCatUploading(false);
    }
  };

  const handleSizeChange = (size) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitSuccess(false);

    if (!name || !price || !description || !image || !category) {
      setError('Please fill in all required fields including image upload');
      return;
    }

    setSubmitting(true);

    try {
      const url = editingProduct 
        ? `${API_URL}/api/products/${editingProduct._id}`
        : `${API_URL}/api/products`;

      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
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
      if (!res.ok) throw new Error(data.message || 'Product action failed');

      setSubmitSuccess(true);
      // Reset form
      setEditingProduct(null);
      setName('');
      setPrice('');
      setDescription('');
      setImage('');
      setCountInStock('10');
      setSizes(['S', 'M', 'L', 'XL']);
      fetchProducts(); // Refresh inventory list
      
      setTimeout(() => {
        setActiveTab('list');
        setSubmitSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to process product listing');
    } finally {
      setSubmitting(false);
    }
  };

  // --- CATEGORY ACTIONS ---

  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();
    setCatError('');
    setCatSuccess('');

    if (!newCatName || !newCatImage) {
      setCatError('Please fill in category name and upload a thumbnail');
      return;
    }

    setCatSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: newCatName, image: newCatImage }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create category');

      setCatSuccess(`Category "${newCatName}" added successfully!`);
      setNewCatName('');
      setNewCatImage('');
      fetchCategories(); // Refresh list
    } catch (err) {
      setCatError(err.message || 'Error creating category');
    } finally {
      setCatSubmitting(false);
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm('Are you sure you want to delete this category? Products in this category will not be deleted, but the category filter will be removed.')) return;
    try {
      const res = await fetch(`${API_URL}/api/categories/${catId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete category');
      setCategoriesList(categoriesList.filter((c) => c._id !== catId));
    } catch (err) {
      alert(err.message || 'Error deleting category');
    }
  };

  // --- COUPON ACTIONS ---

  const handleAddCouponSubmit = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!newCode || !newDiscount) {
      setCouponError('Please enter code and discount percentage');
      return;
    }

    setCouponSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ code: newCode, discount: Number(newDiscount) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create coupon code');

      setCouponSuccess(`Coupon code "${newCode.toUpperCase()}" created!`);
      setNewCode('');
      setNewDiscount('');
      fetchCoupons(); // Refresh coupons
    } catch (err) {
      setCouponError(err.message || 'Error creating coupon');
    } finally {
      setCouponSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon code?')) return;
    try {
      const res = await fetch(`${API_URL}/api/coupons/${couponId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete coupon');
      setCouponsList(couponsList.filter((c) => c._id !== couponId));
    } catch (err) {
      alert(err.message || 'Error deleting coupon');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl min-h-[90vh]">
      {/* Title block & Tabs */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-10 pb-6 border-b border-white/10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage dynamic inventory, category items, and coupons</p>
        </div>
        <div className="flex flex-wrap gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5 justify-center">
          <button
            onClick={() => { setActiveTab('list'); setEditingProduct(null); }}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === 'list' ? 'bg-gold text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === 'add' ? 'bg-gold text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            {editingProduct ? 'Edit Product' : 'Add Product'}
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === 'categories' ? 'bg-gold text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === 'offers' ? 'bg-gold text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Offers/Coupons
          </button>
        </div>
      </div>

      {/* --- TAB 1: PRODUCT LISTING & DELETE/EDIT --- */}
      {activeTab === 'list' && (
        <div className="glass-panel p-8 rounded-2xl bg-[#111113]/40 border border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Product Inventory</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by product name..."
              className="px-4 py-2.5 rounded-full glass-input text-xs w-full md:w-80 focus:outline-none"
            />
          </div>

          {loadingProducts ? (
            <div className="text-center py-20 text-gray-500 font-bold text-sm">
              Loading inventory products...
            </div>
          ) : productsError ? (
            <div className="text-center py-20 text-red-500 font-bold text-sm">{productsError}</div>
          ) : productsList.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-sm">No products in inventory.</div>
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
                  {productsList
                    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((p) => {
                      const img = p.images && p.images[0] ? p.images[0] : p.image;
                      const resolvedImg = img && img.startsWith('http') ? img : `${API_URL}${img}`;
                      return (
                        <tr key={p._id} className="hover:bg-white/[0.01] transition duration-200">
                          <td className="py-4 flex items-center space-x-4">
                            <div className="w-12 h-14 bg-black/40 overflow-hidden flex-shrink-0 border border-white/5 rounded-lg">
                              <img src={resolvedImg} alt={p.name} className="object-cover w-full h-full" />
                            </div>
                            <div>
                              <span className="font-bold text-white block">{p.name}</span>
                              <span className="text-xs text-gray-500 block max-w-xs truncate">{p.description}</span>
                            </div>
                          </td>
                          <td className="py-4 text-gray-300 font-semibold">{p.category}</td>
                          <td className="py-4 text-gold font-bold">${p.price}</td>
                          <td className="py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              p.countInStock > 0 ? 'bg-green-950/40 text-green-400' : 'bg-red-950/40 text-red-400'
                            }`}>
                              {p.countInStock} Left
                            </span>
                          </td>
                          <td className="py-4 text-right space-x-2">
                            <button
                              onClick={() => handleEditClick(p)}
                              className="bg-gold/10 hover:bg-gold hover:text-black border border-gold/20 text-gold text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                            >
                              Edit
                            </button>
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

      {/* --- TAB 2: ADD / EDIT PRODUCT FORM --- */}
      {activeTab === 'add' && (
        <div className="glass-panel p-8 md:p-10 rounded-2xl bg-[#111113]/40 border border-white/5 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">
              {editingProduct ? 'Edit Product Details' : 'Upload Product Listing'}
            </h2>
            {editingProduct && (
              <button 
                onClick={handleCancelEdit}
                className="text-xs text-gray-400 hover:text-white uppercase font-bold border-b border-gray-400 cursor-pointer"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-900/40 text-red-400 rounded font-semibold text-sm">
              {error}
            </div>
          )}

          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-900/40 text-green-400 rounded font-semibold text-sm">
              {editingProduct ? 'Product details updated!' : 'Product listing added!'} Returning to inventory...
            </div>
          )}

          <form onSubmit={handleProductSubmit} className="space-y-6">
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
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Price ($) *</label>
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
                placeholder="Describe product details, fabrics..."
                required
              />
            </div>

            {/* Category Select Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Category *</label>
              {categoriesList.length === 0 ? (
                <p className="text-xs text-red-500 font-bold">Please create categories first in the Categories tab!</p>
              ) : (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm cursor-pointer"
                  required
                >
                  {categoriesList.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Sizes Checkboxes */}
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

            {/* Image Explorer File Uploader */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Product Image *</label>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="flex-grow px-4 py-3 rounded-xl glass-input text-sm"
                  placeholder="Image path or upload below"
                  required
                />
                <label className="bg-gold text-black font-extrabold text-xs px-5 py-3 rounded-xl uppercase tracking-wider hover:opacity-90 cursor-pointer transition duration-300">
                  {uploading ? 'Uploading...' : 'Browse'}
                  <input
                    type="file"
                    onChange={(e) => uploadFileHandler(e, 'product')}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
              {uploadError && <p className="mt-2 text-xs text-red-500 font-bold">{uploadError}</p>}
              {image && (
                <div className="mt-4 w-32 h-40 border border-white/10 overflow-hidden bg-black/40 flex items-center justify-center rounded-xl">
                  <img src={image.startsWith('http') ? image : `${API_URL}${image}`} alt="Preview" className="object-cover w-full h-full" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-gold py-4 rounded-full text-sm font-extrabold uppercase tracking-widest shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Saving changes...' : editingProduct ? 'Update Product' : 'Create Listing'}
            </button>
          </form>
        </div>
      )}

      {/* --- TAB 3: CATEGORY MANAGEMENT --- */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* List of categories */}
          <div className="md:col-span-2 glass-panel p-8 rounded-2xl bg-[#111113]/40 border border-white/5 space-y-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              Store Categories
            </h2>
            
            {categoriesList.length === 0 ? (
              <p className="text-gray-500 text-sm">No categories created yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoriesList.map((cat) => {
                  const resolvedImg = cat.image.startsWith('http') ? cat.image : `${API_URL}${cat.image}`;
                  return (
                    <div 
                      key={cat._id}
                      className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl gap-4"
                    >
                      <div className="flex items-center space-x-4 min-w-0">
                        <div className="w-12 h-12 rounded bg-black/40 overflow-hidden flex-shrink-0 border border-white/10">
                          <img src={resolvedImg} alt={cat.name} className="object-cover w-full h-full" />
                        </div>
                        <span className="font-bold text-white truncate text-sm">{cat.name}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="text-xs text-red-500 hover:text-red-400 font-extrabold uppercase tracking-wider cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add Category Form */}
          <div className="glass-panel p-8 rounded-2xl bg-[#111113]/40 border border-white/5 h-fit space-y-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              Add Category
            </h2>

            {catError && <div className="p-3 bg-red-900/20 text-red-400 rounded text-xs font-bold">{catError}</div>}
            {catSuccess && <div className="p-3 bg-green-900/20 text-green-400 rounded text-xs font-bold">{catSuccess}</div>}

            <form onSubmit={handleAddCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Category Name *</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs focus:outline-none"
                  placeholder="e.g. Male"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Category Thumbnail *</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newCatImage}
                    onChange={(e) => setNewCatImage(e.target.value)}
                    className="flex-grow px-3 py-2.5 rounded-xl glass-input text-xs focus:outline-none"
                    placeholder="URL path"
                    required
                  />
                  <label className="bg-gold text-black font-extrabold text-xs px-3.5 py-2.5 rounded-xl uppercase tracking-wider hover:opacity-90 cursor-pointer transition duration-300 flex-shrink-0 flex items-center justify-center">
                    {catUploading ? '...' : 'Browse'}
                    <input
                      type="file"
                      onChange={(e) => uploadFileHandler(e, 'category')}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
                {catUploadError && <p className="text-xs text-red-500 font-bold mt-1">{catUploadError}</p>}
                {newCatImage && (
                  <div className="mt-4 w-20 h-20 border border-white/10 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                    <img src={newCatImage.startsWith('http') ? newCatImage : `${API_URL}${newCatImage}`} alt="Preview" className="object-cover w-full h-full" />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={catSubmitting}
                className="w-full btn-gold py-3 rounded-full text-xs font-extrabold uppercase tracking-widest transition disabled:opacity-50 cursor-pointer"
              >
                {catSubmitting ? 'Creating...' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- TAB 4: OFFERS & COUPONS MANAGEMENT --- */}
      {activeTab === 'offers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coupon Codes List */}
          <div className="md:col-span-2 glass-panel p-8 rounded-2xl bg-[#111113]/40 border border-white/5 space-y-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              Discount Coupons
            </h2>
            
            {couponsList.length === 0 ? (
              <p className="text-gray-500 text-sm">No discount coupons created yet.</p>
            ) : (
              <div className="space-y-3">
                {couponsList.map((c) => (
                  <div 
                    key={c._id}
                    className="flex justify-between items-center p-4 bg-black/20 border border-white/5 rounded-xl gap-4"
                  >
                    <div>
                      <span className="font-mono font-bold text-white text-base tracking-wider block">{c.code}</span>
                      <span className="text-xs text-gold font-bold">Discount: {c.discount}% OFF</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteCoupon(c._id)}
                      className="text-xs text-red-500 hover:text-red-400 font-extrabold uppercase tracking-wider cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Coupon Form */}
          <div className="glass-panel p-8 rounded-2xl bg-[#111113]/40 border border-white/5 h-fit space-y-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              Create Coupon
            </h2>

            {couponError && <div className="p-3 bg-red-900/20 text-red-400 rounded text-xs font-bold">{couponError}</div>}
            {couponSuccess && <div className="p-3 bg-green-900/20 text-green-400 rounded text-xs font-bold">{couponSuccess}</div>}

            <form onSubmit={handleAddCouponSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Coupon Code *</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs focus:outline-none uppercase"
                  placeholder="e.g. SALE20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Discount Percentage *</label>
                <input
                  type="number"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs focus:outline-none"
                  placeholder="e.g. 20 (for 20% off)"
                  min="1"
                  max="100"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={couponSubmitting}
                className="w-full btn-gold py-3 rounded-full text-xs font-extrabold uppercase tracking-widest transition disabled:opacity-50 cursor-pointer"
              >
                {couponSubmitting ? 'Creating...' : 'Create Coupon'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
