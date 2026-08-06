'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks';
import { getEvent, updateEvent } from '@/lib/api';
import { useToast } from '@/lib/toast/ToastContext';

export default function EditEventPage() {
  const params = useParams();
  const id = params.id as string;
  const { user, checked } = useRequireAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Conference');
  const [location, setLocation] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [startsAt, setStartsAt] = useState('');
  const [price, setPrice] = useState('');
  const [totalTickets, setTotalTickets] = useState('');
  const [ticketsSold, setTicketsSold] = useState(0);

  useEffect(() => {
    if (!checked) return;
    getEvent(id).then((e) => {
      setTitle(e.title);
      setDescription(e.description || '');
      setCategory(e.category || 'Conference');
      setLocation(e.location || '');
      setIsOnline(e.isOnline);
      setStartsAt(new Date(e.startsAt).toISOString().slice(0, 16));
      setPrice((e.priceCents / 100).toString());
      setTotalTickets(e.totalTickets.toString());
      setTicketsSold(e.ticketsSold);
      setLoading(false);
    });
  }, [checked, id]);

  if (!checked || loading) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await updateEvent(id, {
        title, description, category, location: isOnline ? undefined : location, isOnline,
        startsAt: new Date(startsAt).toISOString(),
        priceCents: Math.round(parseFloat(price) * 100),
        totalTickets: parseInt(totalTickets, 10),
      });
      showToast('Event updated', 'success');
      router.push(`/events/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Event</h1>
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6">
          {error && <div className="bg-status-red-bg border border-red-200 text-status-red text-sm rounded-lg p-3 mb-4">{error}</div>}

          <label className="block text-sm font-medium text-gray-800 mb-1">Title</label>
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} />

          <label className="block text-sm font-medium text-gray-800 mb-1">Description</label>
          <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />

          <label className="block text-sm font-medium text-gray-800 mb-1">Category</label>
          <select className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Conference</option><option>Festival</option><option>Seminar</option><option>Networking</option>
          </select>

          <label className="flex items-center gap-2 mb-4 text-sm text-gray-800">
            <input type="checkbox" checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)} /> Online event
          </label>
          {!isOnline && (
            <>
              <label className="block text-sm font-medium text-gray-800 mb-1">Location</label>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm" value={location} onChange={(e) => setLocation(e.target.value)} />
            </>
          )}

          <label className="block text-sm font-medium text-gray-800 mb-1">Date &amp; time</label>
          <input type="datetime-local" className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />

          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Price (KES)</label>
              <input type="number" step="0.01" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Total tickets</label>
              <input type="number" min={ticketsSold} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={totalTickets} onChange={(e) => setTotalTickets(e.target.value)} />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-6">{ticketsSold} already sold &mdash; can't go below this.</p>

          <button type="submit" disabled={saving} className="w-full bg-brand-purple text-white text-sm font-semibold rounded-lg py-2.5 disabled:opacity-50 hover:bg-brand-purple-dark active:scale-95 transition-all duration-150">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
