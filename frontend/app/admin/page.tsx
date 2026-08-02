'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/hooks';
import { useToast } from '@/lib/toast/ToastContext';
import { Sidebar } from '@/lib/components/Sidebar';
import { Skeleton } from '@/lib/components/Skeleton';
import { getAdminStats, getAdminUsers, getAdminEvents, updateEventStatus, getAdminPayments } from '@/lib/api';

type Tab = 'overview' | 'users' | 'events' | 'payments';

export default function AdminPage() {
  const { user, checked, logout } = useRequireAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>('overview');

  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!checked || !user) return;
    if (user.role !== 'ADMIN') return;

    Promise.all([getAdminStats(), getAdminUsers(), getAdminEvents(), getAdminPayments()])
      .then(([s, u, e, p]) => {
        setStats(s);
        setUsers(u);
        setEvents(e);
        setPayments(p);
      })
      .catch(() => showToast('Failed to load admin data', 'error'))
      .finally(() => setLoading(false));
  }, [checked, user]);

  async function handleCancelEvent(eventId: string) {
    try {
      await updateEventStatus(eventId, 'CANCELLED');
      setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, status: 'CANCELLED' } : e)));
      showToast('Event cancelled', 'success');
    } catch {
      showToast('Failed to cancel event', 'error');
    }
  }

  if (!checked) return null;

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-gray-600">Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sidebar active="dashboard" onLogout={logout} />

      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Management</h1>
        <p className="text-sm text-gray-600 mb-6">Platform-wide oversight and controls.</p>

        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {(['overview', 'users', 'events', 'payments'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-semibold capitalize border-b-2 transition-colors ${
                tab === t ? 'border-brand-purple text-brand-purple' : 'border-transparent text-gray-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            {tab === 'overview' && stats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <p className="text-2xl font-bold text-gray-900">{stats.userCount}</p>
                  <p className="text-xs text-gray-400 mt-1">Total Users</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <p className="text-2xl font-bold text-gray-900">{stats.eventCount}</p>
                  <p className="text-xs text-gray-400 mt-1">Total Events</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <p className="text-2xl font-bold text-gray-900">{stats.ticketCount}</p>
                  <p className="text-xs text-gray-400 mt-1">Tickets Sold</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <p className="text-2xl font-bold text-gray-900">
                    KES {(stats.totalRevenueCents / 100).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Total Revenue</p>
                </div>
              </div>
            )}

            {tab === 'users' && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-t border-gray-100">
                        <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                        <td className="px-4 py-3 text-gray-600">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold text-brand-purple bg-brand-purple-light px-2 py-1 rounded-full">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'events' && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Organizer</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Sold</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((e) => (
                      <tr key={e.id} className="border-t border-gray-100">
                        <td className="px-4 py-3 font-medium text-gray-900">{e.title}</td>
                        <td className="px-4 py-3 text-gray-600">{e.organizer?.user?.name}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              e.status === 'PUBLISHED'
                                ? 'text-status-green bg-status-green-bg'
                                : e.status === 'CANCELLED'
                                ? 'text-status-red bg-status-red-bg'
                                : 'text-gray-600 bg-gray-100'
                            }`}
                          >
                            {e.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{e.ticketsSold}/{e.totalTickets}</td>
                        <td className="px-4 py-3">
                          {e.status !== 'CANCELLED' && (
                            <button
                              onClick={() => handleCancelEvent(e.id)}
                              className="text-xs font-semibold text-status-red border border-red-200 rounded-lg px-3 py-1.5 hover:bg-status-red-bg transition-colors"
                            >
                              Cancel Event
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === 'payments' && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Event</th>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-t border-gray-100">
                        <td className="px-4 py-3 font-medium text-gray-900">{p.event?.title}</td>
                        <td className="px-4 py-3 text-gray-600">{p.user?.name}</td>
                        <td className="px-4 py-3 text-gray-600">KES {(p.amountCents / 100).toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              p.status === 'COMPLETED'
                                ? 'text-status-green bg-status-green-bg'
                                : p.status === 'FAILED'
                                ? 'text-status-red bg-status-red-bg'
                                : 'text-status-amber bg-status-amber-bg'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
