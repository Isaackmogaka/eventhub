'use client';
import { useState } from 'react';
import Link from 'next/link';
import { requestPasswordReset } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await requestPasswordReset(email);
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password</h1>
        <p className="text-sm text-gray-600 mb-8">We'll send you a link to reset it.</p>

        {sent ? (
          <div className="bg-status-green-bg border border-green-200 rounded-lg p-4 text-sm text-status-green">
            If that email exists, a reset link has been sent. Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-800 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-4 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-purple text-white text-sm font-semibold rounded-lg py-3 disabled:opacity-50 hover:bg-brand-purple-dark active:scale-95 transition-all duration-150"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="text-sm text-gray-600 text-center mt-6">
          <Link href="/login" className="text-brand-purple font-semibold">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
