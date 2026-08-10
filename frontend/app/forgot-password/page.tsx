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
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-purple to-brand-navy relative overflow-hidden flex-col justify-center px-16">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-2xl mb-6">&#128274;</div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Forgot your<br />password?
          </h1>
          <p className="text-white/80 text-sm max-w-xs">
            No worries. Enter your email and we'll send you a secure link to get back into your account.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-status-green-bg flex items-center justify-center text-3xl mx-auto mb-5">
                &#9993;
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Check your email</h1>
              <p className="text-sm text-gray-600 mb-6">
                If that email exists in our system, we've sent a password reset link to <strong className="text-gray-900">{email}</strong>.
              </p>
              <Link href="/login" className="text-sm font-semibold text-brand-purple">
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password</h1>
              <p className="text-sm text-gray-600 mb-8">Enter your email and we'll send you a reset link.</p>

              <form onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-gray-800 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-6 text-sm"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-purple text-white text-sm font-semibold rounded-lg py-3 disabled:opacity-50 hover:bg-brand-purple-dark active:scale-95 transition-all duration-150"
                >
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>

              <p className="text-sm text-gray-600 text-center mt-6">
                <Link href="/login" className="text-brand-purple font-semibold">Back to login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
