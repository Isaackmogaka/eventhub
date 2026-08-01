'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/lib/components/Sidebar';
import { useRequireAuth } from '@/lib/hooks';
import { getMyTickets } from '@/lib/api';
import { Skeleton } from '@/lib/components/Skeleton';

interface TicketItem {
  id: string;
  qrCode: string;
  quantity: number;
  status: string;
  createdAt: string;
  event: {
    id: string;
    title: string;
    location: string | null;
    isOnline: boolean;
    startsAt: string;
    category: string | null;
  };
}

export default function MyTicketsPage() {
  const { checked, logout } = useRequireAuth();
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!checked) return;
    getMyTickets()
      .then(setTickets)
      .finally(() => setLoading(false));
  }, [checked]);

  if (!checked) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sidebar active="my-tickets" onLogout={logout} />

      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Tickets</h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <Skeleton className="h-24 w-full rounded-none" />
                <div className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-brand-purple-light flex items-center justify-center text-2xl mx-auto mb-4">
              &#127915;
            </div>
            <h2 className="text-sm font-bold text-gray-900 mb-1">No tickets yet</h2>
            <p className="text-xs text-gray-600 mb-5">Once you book an event, your tickets will show up here.</p>
            <Link href="/" className="bg-brand-purple text-white text-sm font-semibold rounded-lg px-5 py-2.5 inline-block hover:bg-brand-purple-dark transition-colors">
              Browse events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/events/${ticket.event.id}`}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden block hover:border-brand-purple hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                <div className="h-24 bg-gradient-to-br from-brand-purple to-brand-navy relative">
                  <span className="absolute top-3 right-3 text-xs font-semibold text-status-green bg-white px-2.5 py-1 rounded-full">
                    {ticket.status}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-bold text-sm text-gray-900 mb-1 truncate">{ticket.event.title}</p>
                  <p className="text-xs text-gray-600 mb-3">
                    {new Date(ticket.event.startsAt).toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })} · {ticket.event.isOnline ? 'Online' : ticket.event.location || 'TBA'}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400 font-mono">{ticket.qrCode}</span>
                    {ticket.quantity > 1 && (
                      <span className="text-xs font-semibold text-brand-purple bg-brand-purple-light px-2 py-1 rounded-full">
                        x{ticket.quantity}
                      </span>
                    )}
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
