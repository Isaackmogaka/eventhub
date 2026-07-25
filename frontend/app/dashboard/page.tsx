'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRequireAuth } from '@/lib/hooks';
import { getEvents } from '@/lib/api';
import { EventCardSkeleton } from '@/lib/components/EventCardSkeleton';

interface EventItem {
  id: string;
  title: string;
  category: string | null;
  location: string | null;
  isOnline: boolean;
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

  const myEvents = user?.role === 'ORGANIZER' ? events : [];
  const upcoming = [...events].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()).slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-60 bg-brand-navy text-white p-4 flex flex-col">
        <Link href="/" className="flex items-center gap-2 px-2 pb-6">
          <div className="w-9 h-9 rounded-lg bg-brand-purple flex items-center justify-center font-bold text-sm">E</div>
          <div>
            <p className="font-bold text-sm">EventHub</p>
            <p className="text-xs text-gray-400">Event Management</p>
          </div>
        </Link>
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

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="w-9 h-9 rounded-lg bg-brand-purple flex items-center justify-center text-white text-sm mb-3">&#128197;</div>
            <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total Events</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="w-9 h-9 rounded-lg bg-status-green flex items-center justify-center text-white text-sm mb-3">&#127915;</div>
            <p className="text-2xl font-bold text-gray-900">&mdash;</p>
            <p className="text-xs text-gray-400 mt-0.5">My Tickets (Phase 4)</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="w-9 h-9 rounded-lg bg-status-amber flex items-center justify-center text-white text-sm mb-3">&#128179;</div>
            <p className="text-2xl font-bold text-gray-900">&mdash;</p>
            <p className="text-xs text-gray-400 mt-0.5">Total Payments (Phase 4)</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="w-9 h-9 rounded-lg bg-status-blue flex items-center justify-center text-white text-sm mb-3">&#11088;</div>
            <p className="text-2xl font-bold text-gray-900">&mdash;</p>
            <p className="text-xs text-gray-400 mt-0.5">Saved Events (future)</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900">Upcoming Events</h2>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-xs text-gray-600">No upcoming events.</p>
            ) : (
              upcoming.map((e) => (
                <Link key={e.id} href={`/events/${e.id}`} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-purple to-brand-navy flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{e.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(e.startsAt).toLocaleDateString()} · {e.isOnline ? 'Online' : e.location || 'TBA'}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-brand-purple bg-brand-purple-light px-2 py-1 rounded-full flex-shrink-0">
                    {e.category || 'Event'}
                  </span>
                </Link>
              ))
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900">Recent Tickets</h2>
            </div>
            <p className="text-xs text-gray-600">Ticket history arrives in Phase 4, once payments are wired up.</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">{user?.role === 'ORGANIZER' ? 'Your Events' : 'Events'}</h2>
          {user?.role === 'ORGANIZER' && (
            <Link
              href="/events/new"
              className="bg-brand-purple text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-brand-purple-dark active:scale-95 transition-all duration-150"
            >
              + Create Event
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-sm text-gray-600">No events yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {events.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="bg-white border border-gray-200 rounded-xl overflow-hidden block hover:border-brand-purple hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                <div className="h-24 bg-gradient-to-br from-brand-purple to-brand-navy" />
                <div className="p-4">
                  <p className="font-bold text-sm text-gray-900 mb-1">{event.title}</p>
                  <p className="text-xs text-gray-600 mb-2">
                    {new Date(event.startsAt).toLocaleDateString()} · {event.isOnline ? 'Online' : event.location || 'TBA'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900">
                      {event.priceCents === 0 ? 'Free' : `$${(event.priceCents / 100).toFixed(2)}`}
                    </span>
                    <span className="text-xs font-semibold text-brand-purple bg-brand-purple-light px-2.5 py-1 rounded-full">
                      {event.category || 'Event'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
