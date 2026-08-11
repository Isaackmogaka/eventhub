'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PasswordInput } from '@/lib/components/PasswordInput';
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

  const heroPanel = (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-purple to-brand-navy relative overflow-hidden flex-col justify-center px-16">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-2xl mb-6">&#128273;</div>
        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
          Almost<br />there.
        </h1>
        <p className="text-white/80 text-sm max-w-xs">
          Set a new password and you'll be right back in.
        </p>
      </div>
    </div>
  );

  if (!token) {
    return (
      <div className="min-h-screen flex">
        {heroPanel}
        <div className="flex-1 flex items-center justify-center bg-background px-6 text-center">
          <div>
            <div className="w-14 h-14 rounded-full bg-status-red-bg flex items-center justify-center text-2xl mx-auto mb-4">&#9888;</div>
            <p className="text-sm text-gray-600 mb-4">Invalid or missing reset link.</p>
            <Link href="/forgot-password" className="text-brand-purple font-semibold text-sm">Request a new one</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {heroPanel}
      <div className="flex-1 flex items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-status-green-bg flex items-center justify-center text-3xl mx-auto mb-5">&#10003;</div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Password reset!</h1>
              <p className="text-sm text-gray-600">Redirecting you to login...</p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Reset Password</h1>
              <p className="text-sm text-gray-600 mb-8">Choose a new password for your account.</p>

              <form onSubmit={handleSubmit}>
                {error && <div className="bg-status-red-bg border border-red-200 text-status-red text-sm rounded-lg p-3 mb-4">{error}</div>}
                <label className="block text-sm font-medium text-gray-800 mb-1">New Password</label>
                <PasswordInput
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-4 text-sm"
                />
                <label className="block text-sm font-medium text-gray-800 mb-1">Confirm Password</label>
                <PasswordInput
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
            </>
          )}
        </div>
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
