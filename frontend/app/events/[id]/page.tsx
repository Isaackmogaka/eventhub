'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getEvent, createHold, cancelHold, payWithMpesa, getPaymentStatus } from '@/lib/api';
import dynamic from 'next/dynamic';

const LocationDisplay = dynamic(() => import('@/lib/components/LocationDisplay').then((m) => m.LocationDisplay), { ssr: false });
import { io, Socket } from 'socket.io-client';
import { useToast } from '@/lib/toast/ToastContext';
import { Skeleton } from '@/lib/components/Skeleton';
import { getToken, getUser } from '@/lib/auth';

interface EventDetail {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
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
  const { showToast } = useToast();
  const id = params.id as string;

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [hold, setHold] = useState<HoldInfo | null>(null);
  const [holdError, setHoldError] = useState('');
  const [holding, setHolding] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [liveAvailable, setLiveAvailable] = useState<number | null>(null);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStep, setPaymentStep] = useState<'idle' | 'awaiting' | 'success' | 'failed'>('idle');
  const [paymentError, setPaymentError] = useState('');
  const [ticket, setTicket] = useState<{ id: string; qrCode: string } | null>(null);

  useEffect(() => {
    getEvent(id)
      .then(setEvent)
      .catch(() => setError('This event could not be found.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Real-time availability: connect, join this event's room, listen for updates
  useEffect(() => {
    const socket: Socket = io(process.env.NEXT_PUBLIC_API_URL!);

    socket.emit('join-event', id);

    socket.on('availability-update', (data: { eventId: string; available: number }) => {
      if (data.eventId === id) {
        setLiveAvailable(data.available);
      }
    });

    return () => {
      socket.emit('leave-event', id);
      socket.disconnect();
    };
  }, [id]);

  // Listen for payment confirmation, pushed directly to this user
  useEffect(() => {
    const user = getUser();
    if (!user) return;

    const socket: Socket = io(process.env.NEXT_PUBLIC_API_URL!);
    socket.emit('join-user', user.id);

    socket.on('payment-update', (data: { holdId: string; status: string; ticket?: { id: string; qrCode: string } }) => {
      if (hold && data.holdId === hold.id) {
        if (data.status === 'COMPLETED' && data.ticket) {
          setPaymentStep('success');
          setTicket(data.ticket);
          showToast('Payment confirmed! Your ticket is ready.', 'success');
        } else if (data.status === 'FAILED') {
          setPaymentStep('failed');
          showToast('Payment failed or was cancelled.', 'error');
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [hold]);

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
      showToast('Reservation cancelled.', 'info');
    } catch (err) {
      setHoldError(err instanceof Error ? err.message : 'Failed to cancel reservation');
    }
  }

  async function handlePay() {
    if (!hold) return;
    if (!/^2547\d{8}$/.test(phoneNumber)) {
      setPaymentError('Enter a valid M-Pesa number, e.g. 254712345678');
      return;
    }
    setPaymentError('');
    try {
      await payWithMpesa(hold.id, phoneNumber);
      setPaymentStep('awaiting');
      showToast('Check your phone to complete payment.', 'info');
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'Something went wrong');
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
      showToast('Ticket reserved! Complete checkout within 10 minutes.', 'success');
    } catch (err) {
      setHoldError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setHolding(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <Skeleton className="h-4 w-24 mb-6" />
          <Skeleton className="h-56 w-full rounded-xl mb-6" />
          <Skeleton className="h-6 w-24 rounded-full mb-3" />
          <Skeleton className="h-8 w-2/3 mb-3" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3 mb-8" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
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

  const initialAvailable = event.totalTickets - event.ticketsSold;
  const available = liveAvailable !== null ? liveAvailable : initialAvailable;

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

        <div className="h-56 rounded-xl bg-gradient-to-br from-brand-purple to-brand-navy mb-6 relative">
          <div className="absolute top-3 left-3 bg-brand-purple text-white text-xs font-semibold px-3 py-1 rounded-full">
            Featured
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            <button className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-sm">&#9825;</button>
            <button className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-sm">&#8635;</button>
          </div>
        </div>

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

        {!event.isOnline && event.latitude && event.longitude && (
          <div className="mb-6">
            <LocationDisplay lat={event.latitude} lng={event.longitude} />
          </div>
        )}

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
          {!hold && (
            <button
              onClick={handleGetTicket}
              disabled={available <= 0 || holding}
              className="bg-brand-purple text-white font-semibold rounded-lg px-6 py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-purple-dark active:scale-95 transition-all duration-150"
            >
              {holding ? 'Reserving...' : available > 0 ? 'Get Ticket' : 'Sold Out'}
            </button>
          )}

          {hold && paymentStep === 'idle' && (
            <div className="flex items-center gap-2">
              <input
                type="tel"
                placeholder="254712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm w-40"
              />
              <button
                onClick={handlePay}
                className="bg-status-green text-white font-semibold rounded-lg px-5 py-2.5 text-sm hover:opacity-90 active:scale-95 transition-all duration-150"
              >
                Pay with M-Pesa
              </button>
            </div>
          )}

          {hold && paymentStep === 'awaiting' && (
            <div className="flex items-center gap-2 text-status-amber text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-status-amber animate-pulse"></span>
              Check your phone…
            </div>
          )}

          {hold && paymentStep === 'success' && ticket && (
            <div className="text-right">
              <p className="text-status-green text-sm font-bold mb-1">&#10003; Ticket confirmed</p>
              <p className="text-xs text-gray-600 font-mono">{ticket.qrCode}</p>
            </div>
          )}

          {hold && paymentStep === 'failed' && (
            <button
              onClick={() => setPaymentStep('idle')}
              className="bg-status-red text-white font-semibold rounded-lg px-5 py-2.5 text-sm hover:opacity-90 active:scale-95 transition-all duration-150"
            >
              Payment failed — Try again
            </button>
          )}
        </div>

        {paymentError && (
          <div className="bg-status-red-bg border border-red-200 text-status-red text-sm rounded-lg p-3 mt-4">
            {paymentError}
          </div>
        )}
      </div>
    </div>
  );
}
