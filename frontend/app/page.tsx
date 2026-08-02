'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

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
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Glassmorphism nav */}
      <header className="border-b border-gray-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
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

      {/* Hero with gradient mesh background */}
      <section className="relative">
        <div
          className="absolute inset-0 -z-10 opacity-90"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 20% 0%, rgba(79,70,229,0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 85% 20%, rgba(30,27,75,0.15), transparent 60%), radial-gradient(ellipse 50% 40% at 50% 100%, rgba(16,185,129,0.10), transparent 60%)',
          }}
        />
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <span className="inline-block text-xs font-semibold text-brand-purple bg-brand-purple-light px-3 py-1.5 rounded-full mb-5">
              &#9889; Live ticket availability &middot; M-Pesa checkout
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight tracking-tight">
              Find events near you.<br />
              <span className="bg-gradient-to-r from-brand-purple to-status-green bg-clip-text text-transparent">
                Pay instantly with M-Pesa.
              </span>
            </h1>
            <p className="text-sm md:text-base text-gray-600 max-w-lg mx-auto mb-8">
              Kenya's simplest way to discover, reserve, and pay for events — conferences,
              festivals, and more — with real-time availability and secure checkout.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="bg-brand-purple text-white text-sm font-semibold rounded-lg px-6 py-3 shadow-lg shadow-brand-purple/30 hover:bg-brand-purple-dark hover:shadow-xl active:scale-95 transition-all duration-150"
              >
                Get started free
              </Link>
              <a href="#events" className="text-sm font-semibold text-gray-700 hover:text-brand-purple transition-colors">
                Browse events &darr;
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento grid: features */}
      <motion.section
        className="max-w-6xl mx-auto px-6 pb-16"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4">
          {/* Large featured card */}
          <div className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-brand-navy to-brand-purple rounded-2xl p-8 text-white flex flex-col justify-between overflow-hidden relative">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }} />
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center text-lg mb-4">&#9889;</div>
              <h3 className="text-xl font-bold mb-2">Real-time availability</h3>
              <p className="text-sm text-white/80 max-w-sm">
                Ticket counts update live across every device the instant someone reserves —
                no refreshing, no overselling, no surprises at checkout.
              </p>
            </div>
            <div className="relative flex items-center gap-2 text-xs font-semibold text-white/70 mt-8">
              <span className="w-2 h-2 rounded-full bg-status-green animate-pulse"></span>
              Live sync via WebSockets
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-lg bg-status-green-bg text-status-green flex items-center justify-center text-lg mb-3">&#128241;</div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">M-Pesa checkout</h3>
            <p className="text-xs text-gray-600">Pay directly from your phone. No cards required.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-lg bg-status-blue-bg text-status-blue flex items-center justify-center text-lg mb-3">&#127915;</div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Instant tickets</h3>
            <p className="text-xs text-gray-600">QR-coded confirmation the moment payment clears.</p>
          </div>
        </div>
      </motion.section>

      {/* How it works */}
      <motion.section
        className="bg-white border-y border-gray-200 py-16"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
      >
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-10">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            <div className="hidden sm:block absolute top-4 left-[16.5%] right-[16.5%] h-px bg-gray-200" />
            {[
              { n: '1', title: 'Find an event', desc: 'Browse by category, date, or location.' },
              { n: '2', title: 'Reserve your ticket', desc: 'We hold it for 10 minutes while you check out.' },
              { n: '3', title: 'Pay with M-Pesa', desc: 'Approve on your phone, get your ticket instantly.' },
            ].map((step) => (
              <div key={step.n} className="text-center relative">
                <div className="w-8 h-8 rounded-full bg-brand-purple text-white text-sm font-bold flex items-center justify-center mx-auto mb-3 relative z-10">
                  {step.n}
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">{step.title}</p>
                <p className="text-xs text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Events */}
      <section id="events" className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming events</h2>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-150 ${
                activeCategory === cat
                  ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
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
            {filteredEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
              >
                <Link
                  href={`/events/${event.id}`}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden block hover:border-brand-purple hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
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
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-purple flex items-center justify-center text-white font-bold text-xs">E</div>
            <span className="text-sm font-bold text-gray-900">EventHub</span>
          </div>
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} EventHub. Built for the Kenyan market.</p>
        </div>
      </footer>
    </div>
  );
}
