'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getEvent, createHold, cancelHold } from '@/lib/api';
import { getToken } from '@/lib/auth';

interface EventDetail {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  location: string | null;
  isOnline: boolean;
  startsAt: string;
  priceCents: number;
  totalTickets: number;
  ticketsSold: number;
  status: string;
}

interface HoldInfo {
  id: string;
  quantity: number;
  expiresAt: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [hold, setHold] = useState<HoldInfo | null>(null);
  const [holdError, setHoldError] = useState('');
  const [holding, setHolding] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    getEvent(id)
      .then(setEvent)
      .catch(() => setError('This event could not be found.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Countdown timer: recalculates every second while a hold is active
  useEffect(() => {
    if (!hold) {
      setSecondsLeft(null);
      return;
    }

    function tick() {
      const remaining = Math.max(0, Math.floor((new Date(hold!.expiresAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) {
        setHold(null);
        setHoldError('Your reservation expired. Please try again.');
      }
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [hold]);

  async function handleCancel() {
    if (!hold) return;
    try {
      await cancelHold(hold.id);
      setHold(null);
      setHoldError('');
    } catch (err) {
      setHoldError(err instanceof Error ? err.message : 'Failed to cancel reservation');
    }
  }

  async function handleGetTicket() {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    setHoldError('');
    setHolding(true);
    try {
      const newHold = await createHold(id, 1);
      setHold(newHold);
    } catch (err) {
      setHoldError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setHolding(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-gray-600">Loading event...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
        <p className="text-sm text-gray-600">{error || 'Event not found.'}</p>
        <Link href="/dashboard" className="text-brand-purple text-sm font-semibold">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const available = event.totalTickets - event.ticketsSold;

  function formatCountdown(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/dashboard" className="text-sm text-gray-600 mb-6 inline-block">
          &larr; Back to events
        </Link>

        <div className="h-56 rounded-xl bg-gradient-to-br from-brand-purple to-brand-navy mb-6" />

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-brand-purple bg-brand-purple-light px-2.5 py-1 rounded-full">
            {event.category || 'Event'}
          </span>
          {event.isOnline && (
            <span className="text-xs font-semibold text-status-blue bg-status-blue-bg px-2.5 py-1 rounded-full">
              Online Event
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h1>

        <p className="text-sm text-gray-600 mb-1">
          &#128197; {new Date(event.startsAt).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })} · {new Date(event.startsAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="text-sm text-gray-600 mb-6">
          &#128205; {event.isOnline ? 'Online' : event.location || 'Location TBA'}
        </p>

        {event.description && (
          <p className="text-sm text-gray-800 leading-relaxed mb-8">{event.description}</p>
        )}

        {hold && secondsLeft !== null && (
          <div className="bg-status-amber-bg border border-amber-200 rounded-xl p-4 mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-status-amber">Ticket reserved</p>
              <p className="text-xs text-gray-600 mt-0.5">Complete checkout before your hold expires.</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-lg font-bold text-status-amber tabular-nums">{formatCountdown(secondsLeft)}</p>
              <button
                onClick={handleCancel}
                className="text-xs font-semibold text-gray-600 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {holdError && (
          <div className="bg-status-red-bg border border-red-200 text-status-red text-sm rounded-lg p-3 mb-4">
            {holdError}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {event.priceCents === 0 ? 'Free' : `$${(event.priceCents / 100).toFixed(2)}`}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {available > 0 ? `${available} tickets left` : 'Sold out'}
            </p>
          </div>
          {hold ? (
            <button
              disabled
              className="bg-status-green text-white font-semibold rounded-lg px-6 py-2.5 text-sm opacity-70 cursor-not-allowed"
            >
              Reserved — checkout in Phase 4
            </button>
          ) : (
            <button
              onClick={handleGetTicket}
              disabled={available <= 0 || holding}
              className="bg-brand-purple text-white font-semibold rounded-lg px-6 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {holding ? 'Reserving...' : available > 0 ? 'Get Ticket' : 'Sold Out'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
