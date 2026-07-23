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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-600 mb-6">Sign in to your account</p>

        {error && (
          <div className="bg-status-red-bg border border-red-200 text-status-red text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium text-gray-800 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm"
          required
        />

        <label className="block text-sm font-medium text-gray-800 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-6 text-sm"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-purple text-white font-semibold rounded-lg py-2.5 text-sm disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <p className="text-sm text-gray-600 text-center mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-brand-purple font-semibold">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
