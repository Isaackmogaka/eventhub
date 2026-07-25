'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks';
import { createEvent } from '@/lib/api';

export default function NewEventPage() {
  const { user, checked } = useRequireAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Conference');
  const [location, setLocation] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [startsAt, setStartsAt] = useState('');
  const [price, setPrice] = useState('');
  const [totalTickets, setTotalTickets] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!checked) return null;

  if (user?.role !== 'ORGANIZER') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-3">
        <p className="text-sm text-gray-600">Only organizers can create events.</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const priceCents = Math.round(parseFloat(price) * 100);
    const ticketsNum = parseInt(totalTickets, 10);

    if (!title || !startsAt || isNaN(priceCents) || priceCents < 0 || isNaN(ticketsNum) || ticketsNum < 1) {
      setError('Please fill in all required fields with valid values.');
      return;
    }

    setLoading(true);
    try {
      const event = await createEvent({
        title,
        description: description || undefined,
        category,
        location: isOnline ? undefined : location,
        isOnline,
        startsAt: new Date(startsAt).toISOString(),
        priceCents,
        totalTickets: ticketsNum,
      });
      router.push(`/events/${event.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create an event</h1>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6">
          {error && (
            <div className="bg-status-red-bg border border-red-200 text-status-red text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <label className="block text-sm font-medium text-gray-800 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm"
            required
          />

          <label className="block text-sm font-medium text-gray-800 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm"
            rows={3}
          />

          <label className="block text-sm font-medium text-gray-800 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm"
          >
            <option>Conference</option>
            <option>Festival</option>
            <option>Seminar</option>
            <option>Networking</option>
          </select>

          <label className="flex items-center gap-2 mb-4 text-sm text-gray-800">
            <input type="checkbox" checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)} />
            This is an online event
          </label>

          {!isOnline && (
            <>
              <label className="block text-sm font-medium text-gray-800 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm"
              />
            </>
          )}

          <label className="block text-sm font-medium text-gray-800 mb-1">Date &amp; time</label>
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm"
            required
          />

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Price (USD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">Total tickets</label>
              <input
                type="number"
                min="1"
                value={totalTickets}
                onChange={(e) => setTotalTickets(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-purple text-white font-semibold rounded-lg py-2.5 text-sm disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create event'}
          </button>
        </form>
      </div>
    </div>
  );
}
