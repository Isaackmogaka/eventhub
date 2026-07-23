'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '@/lib/hooks';
import { getEvents } from '@/lib/api';

interface EventItem {
  id: string;
  title: string;
  category: string | null;
  location: string | null;
  startsAt: string;
  priceCents: number;
  totalTickets: number;
  ticketsSold: number;
}

export default function DashboardPage() {
  const { user, checked, logout } = useRequireAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!checked) return;
    getEvents()
      .then(setEvents)
      .finally(() => setLoading(false));
  }, [checked]);

  if (!checked) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-60 bg-brand-navy text-white p-4 flex flex-col">
        <div className="flex items-center gap-2 px-2 pb-6">
          <div className="w-9 h-9 rounded-lg bg-brand-purple flex items-center justify-center font-bold text-sm">E</div>
          <div>
            <p className="font-bold text-sm">EventHub</p>
            <p className="text-xs text-gray-400">Event Management</p>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-1 text-sm">
          <span className="bg-brand-purple rounded-lg px-3 py-2.5 font-semibold">Dashboard</span>
          <span className="px-3 py-2.5 text-gray-300">Events</span>
          <span className="px-3 py-2.5 text-gray-300">My Tickets</span>
        </nav>
        <button onClick={logout} className="text-left text-sm text-gray-300 px-3 py-2.5 hover:text-white">
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">
            Welcome, <span className="font-semibold text-gray-900">{user?.name}</span> ({user?.role})
          </p>
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-4">Events</h2>
        {loading ? (
          <p className="text-sm text-gray-600">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-sm text-gray-600">No events yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="h-24 bg-gradient-to-br from-brand-purple to-brand-navy" />
                <div className="p-4">
                  <p className="font-bold text-sm text-gray-900 mb-1">{event.title}</p>
                  <p className="text-xs text-gray-600 mb-2">
                    {new Date(event.startsAt).toLocaleDateString()} · {event.location || 'Online'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900">
                      ${(event.priceCents / 100).toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold text-brand-purple bg-brand-purple-light px-2.5 py-1 rounded-full">
                      {event.category || 'Event'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
