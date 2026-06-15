'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, setError } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter all fields');
      return;
    }
    setSubmitting(true);
    await login(email, password);
    setSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-background py-12">
      <div className="bg-[#111113]/40 p-10 shadow-2xl w-full max-w-md border border-white/5 rounded-3xl glass-panel border-t-4 border-t-gold">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-white uppercase tracking-wider">Login</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-900/40 text-red-400 rounded-xl text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm focus:outline-none" 
              placeholder="Enter email" 
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm focus:outline-none" 
              placeholder="Enter password" 
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={submitting}
            className="w-full btn-gold py-4 rounded-full text-sm font-extrabold uppercase tracking-widest transition disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-gold font-bold hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}