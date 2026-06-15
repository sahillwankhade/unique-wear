'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, error, setError } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    await register(name, email, password);
    setSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-gray-50 dark:bg-black py-12">
      <div className="bg-white dark:bg-gray-950 p-10 shadow-2xl w-full max-w-md border-t-4 border-gold">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-black dark:text-white uppercase tracking-wider">Register</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-black dark:text-white rounded focus:outline-none focus:border-gold transition" 
              placeholder="Enter name" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-black dark:text-white rounded focus:outline-none focus:border-gold transition" 
              placeholder="Enter email" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-black dark:text-white rounded focus:outline-none focus:border-gold transition" 
              placeholder="Enter password" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-black dark:text-white rounded focus:outline-none focus:border-gold transition" 
              placeholder="Confirm password" 
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-black text-white dark:bg-white dark:text-black font-bold py-3 uppercase tracking-widest hover:bg-gold hover:text-black transition disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-gold font-bold hover:underline">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}
