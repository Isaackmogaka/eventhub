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

const categories = ['All', 'Conference', 'Festival', 'Seminar', 'Networking'];

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents =
    activeCategory === 'All' ? events : events.filter((e) => e.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10 backdrop-blur-sm bg-white/90">
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
              className="bg-brand-purple text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-brand-purple-dark active:scale-95 transition-all duration-150"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Find events near you.<br />Pay instantly with M-Pesa.
        </h1>
        <p className="text-sm text-gray-600 max-w-lg mx-auto mb-8">
          EventHub is Kenya's simplest way to discover, reserve, and pay for events — conferences,
          festivals, and more — with real-time ticket availability and secure M-Pesa checkout.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-brand-purple text-white text-sm font-semibold rounded-lg px-6 py-3 hover:bg-brand-purple-dark active:scale-95 transition-all duration-150"
          >
            Get started free
          </Link>
          <a href="#events" className="text-sm font-semibold text-gray-700">
            Browse events &darr;
          </a>
        </div>
      </section>

      {/* Trust signals */}
      <section className="max-w-5xl mx-auto px-6 pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
            <div className="w-10 h-10 rounded-lg bg-status-green-bg text-status-green flex items-center justify-center text-lg mx-auto mb-3">
              &#128241;
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">Secure M-Pesa Checkout</p>
            <p className="text-xs text-gray-600">Pay directly from your phone. No cards needed.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
            <div className="w-10 h-10 rounded-lg bg-brand-purple-light text-brand-purple flex items-center justify-center text-lg mx-auto mb-3">
              &#9889;
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">Real-Time Availability</p>
            <p className="text-xs text-gray-600">See ticket counts update live — never guess.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
            <div className="w-10 h-10 rounded-lg bg-status-blue-bg text-status-blue flex items-center justify-center text-lg mx-auto mb-3">
              &#127915;
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">Instant Confirmation</p>
            <p className="text-xs text-gray-600">Your ticket and QR code, ready right away.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-200 py-14">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-8">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-8 h-8 rounded-full bg-brand-purple text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">1</div>
              <p className="text-sm font-bold text-gray-900 mb-1">Find an event</p>
              <p className="text-xs text-gray-600">Browse by category, date, or location.</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 rounded-full bg-brand-purple text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">2</div>
              <p className="text-sm font-bold text-gray-900 mb-1">Reserve your ticket</p>
              <p className="text-xs text-gray-600">We hold it for 10 minutes while you check out.</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 rounded-full bg-brand-purple text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">3</div>
              <p className="text-sm font-bold text-gray-900 mb-1">Pay with M-Pesa</p>
              <p className="text-xs text-gray-600">Approve on your phone, get your ticket instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming events</h2>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                activeCategory === cat
                  ? 'bg-brand-purple text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-purple'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <p className="text-sm text-gray-600">No events found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event) => (
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
                      {event.priceCents === 0 ? 'Free' : `KES ${(event.priceCents / 100).toLocaleString()}`}
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
