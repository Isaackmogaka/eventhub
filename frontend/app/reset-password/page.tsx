'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '@/lib/api';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6 text-center">
        <div>
          <p className="text-sm text-gray-600 mb-4">Invalid or missing reset link.</p>
          <Link href="/forgot-password" className="text-brand-purple font-semibold text-sm">Request a new one</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Reset Password</h1>
        <p className="text-sm text-gray-600 mb-8">Choose a new password for your account.</p>

        {success ? (
          <div className="bg-status-green-bg border border-green-200 rounded-lg p-4 text-sm text-status-green">
            Password reset! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="bg-status-red-bg border border-red-200 text-status-red text-sm rounded-lg p-3 mb-4">{error}</div>}
            <label className="block text-sm font-medium text-gray-800 mb-1">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-4 text-sm"
            />
            <label className="block text-sm font-medium text-gray-800 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-6 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-purple text-white text-sm font-semibold rounded-lg py-3 disabled:opacity-50 hover:bg-brand-purple-dark active:scale-95 transition-all duration-150"
            >
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
