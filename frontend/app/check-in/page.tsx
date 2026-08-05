'use client';

import { useState } from 'react';
import { useRequireAuth } from '@/lib/hooks';
import { Sidebar } from '@/lib/components/Sidebar';
import { checkInTicket } from '@/lib/api';

export default function CheckInPage() {
  const { user, checked, logout } = useRequireAuth();
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ ok: boolean; message: string; name?: string; event?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  if (!checked) return null;
  if (user?.role !== 'ORGANIZER' && user?.role !== 'ADMIN') {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-sm text-gray-600">Organizer or admin access required.</p></div>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const data = await checkInTicket(code.trim());
      setResult({ ok: true, message: 'Access Granted', name: data.ticket.user.name, event: data.ticket.event.title });
    } catch (err) {
      setResult({ ok: false, message: err instanceof Error ? err.message : 'Invalid ticket' });
    } finally {
      setLoading(false);
      setCode('');
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sidebar active="dashboard" onLogout={logout} isAdmin={user?.role === 'ADMIN'} isOrganizer={user?.role === 'ORGANIZER'} />
      <main className="flex-1 p-4 md:p-8 max-w-md mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Ticket Check-In</h1>
        <p className="text-sm text-gray-600 mb-8">Enter or scan a ticket's QR code to confirm entry.</p>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <label className="block text-sm font-medium text-gray-800 mb-1">Ticket Code</label>
          <input
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="EVH-XXXXXXXX"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-4 text-sm font-mono"
          />
          <button type="submit" disabled={loading || !code} className="w-full bg-brand-purple text-white text-sm font-semibold rounded-lg py-2.5 disabled:opacity-50 hover:bg-brand-purple-dark active:scale-95 transition-all duration-150">
            {loading ? 'Checking...' : 'Check In'}
          </button>
        </form>

        {result && (
          <div className={`rounded-xl p-5 text-center ${result.ok ? 'bg-status-green-bg border border-green-200' : 'bg-status-red-bg border border-red-200'}`}>
            <p className={`text-lg font-bold ${result.ok ? 'text-status-green' : 'text-status-red'}`}>{result.message}</p>
            {result.ok && <p className="text-sm text-gray-700 mt-1">{result.name} &middot; {result.event}</p>}
          </div>
        )}
      </main>
    </div>
  );
}
