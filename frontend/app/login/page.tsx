'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser } from '@/lib/api';
import { saveSession } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      saveSession(data.token, data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-purple to-brand-navy relative overflow-hidden flex-col justify-center px-16">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative">
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Discover.<br />Book.<br />Experience.
          </h1>
          <p className="text-white/80 text-sm max-w-xs">
            Find and book amazing events near you. Make memories that last forever.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-background px-6 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h1>
          <p className="text-sm text-gray-600 mb-8">Sign in to your account</p>

          {error && (
            <div className="bg-status-red-bg border border-red-200 text-status-red text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <label className="block text-sm font-medium text-gray-800 mb-1">Username</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your username"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-4 text-sm"
            required
          />

          <label className="block text-sm font-medium text-gray-800 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-6 text-sm"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-purple text-white font-semibold rounded-lg py-3 text-sm disabled:opacity-50 mb-4"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>

          <p className="text-sm text-brand-purple font-semibold text-center mb-6">
            Forgot Password?
          </p>

          <p className="text-sm text-gray-600 text-center">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-brand-purple font-semibold">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
