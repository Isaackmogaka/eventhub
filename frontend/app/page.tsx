'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
}

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center text-white font-bold text-sm">
              E
            </div>
            <span className="font-bold text-gray-900">EventHub</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-gray-700">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-brand-purple text-white text-sm font-semibold rounded-lg px-4 py-2"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-14 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Discover. Book. Experience.</h1>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Find and book amazing events near you. Make memories that last forever.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming events</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-sm text-gray-600">No events available yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden block hover:border-brand-purple hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                <div className="h-24 bg-gradient-to-br from-brand-purple to-brand-navy" />
                <div className="p-4">
                  <p className="font-bold text-sm text-gray-900 mb-1">{event.title}</p>
                  <p className="text-xs text-gray-600 mb-2">
                    {new Date(event.startsAt).toLocaleDateString()} ·{' '}
                    {event.isOnline ? 'Online' : event.location || 'TBA'}
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
      </section>
    </div>
  );
}
