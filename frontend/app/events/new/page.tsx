'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/hooks';
import { createEvent } from '@/lib/api';

const steps = ['Details', 'Ticketing', 'Review'];

export default function NewEventPage() {
  const { user, checked } = useRequireAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Conference');
  const [location, setLocation] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [startsAt, setStartsAt] = useState('');
  const [price, setPrice] = useState('');
  const [totalTickets, setTotalTickets] = useState('');

  if (!checked) return null;
  if (user?.role !== 'ORGANIZER') {
    return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-sm text-gray-600">Only organizers can create events.</p></div>;
  }

  function validateStep(): boolean {
    setError('');
    if (step === 0 && (!title || !startsAt)) { setError('Title and date are required.'); return false; }
    if (step === 1) {
      const p = parseFloat(price), t = parseInt(totalTickets, 10);
      if (isNaN(p) || p < 0 || isNaN(t) || t < 1) { setError('Enter a valid price and ticket count.'); return false; }
    }
    return true;
  }

  function next() { if (validateStep()) setStep((s) => Math.min(s + 1, steps.length - 1)); }
  function back() { setError(''); setStep((s) => Math.max(s - 1, 0)); }

  async function handleSubmit() {
    setLoading(true);
    try {
      const event = await createEvent({
        title, description: description || undefined, category,
        location: isOnline ? undefined : location, isOnline,
        startsAt: new Date(startsAt).toISOString(),
        priceCents: Math.round(parseFloat(price) * 100),
        totalTickets: parseInt(totalTickets, 10),
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
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center gap-3">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i <= step ? 'bg-brand-purple text-white' : 'bg-gray-100 text-gray-400'}`}>{i + 1}</div>
              <span className={`text-xs font-semibold ${i <= step ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-brand-purple' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-10">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          {error && <div className="bg-status-red-bg border border-red-200 text-status-red text-sm rounded-lg p-3 mb-4">{error}</div>}

          {step === 0 && (
            <>
              <h2 className="text-sm font-bold text-gray-900 mb-4">Event details</h2>
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
              <input type="datetime-local" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="text-sm font-bold text-gray-900 mb-4">Ticketing</h2>
              <label className="block text-sm font-medium text-gray-800 mb-1">Price (KES)</label>
              <input type="number" step="0.01" min="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm" value={price} onChange={(e) => setPrice(e.target.value)} />
              <label className="block text-sm font-medium text-gray-800 mb-1">Total tickets</label>
              <input type="number" min="1" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={totalTickets} onChange={(e) => setTotalTickets(e.target.value)} />
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-sm font-bold text-gray-900 mb-4">Review &amp; launch</h2>
              <div className="text-sm space-y-2 mb-2">
                <p><strong className="text-gray-700">Title:</strong> {title}</p>
                <p><strong className="text-gray-700">Category:</strong> {category}</p>
                <p><strong className="text-gray-700">Where:</strong> {isOnline ? 'Online' : location || 'TBA'}</p>
                <p><strong className="text-gray-700">When:</strong> {startsAt ? new Date(startsAt).toLocaleString() : ''}</p>
                <p><strong className="text-gray-700">Price:</strong> {price ? `KES ${parseFloat(price).toLocaleString()}` : ''}</p>
                <p><strong className="text-gray-700">Tickets:</strong> {totalTickets}</p>
              </div>
            </>
          )}

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
            <button onClick={back} disabled={step === 0} className="text-sm font-semibold text-gray-600 disabled:opacity-30">Back</button>
            {step < steps.length - 1 ? (
              <button onClick={next} className="bg-brand-purple text-white text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-brand-purple-dark active:scale-95 transition-all duration-150">Next</button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="bg-brand-purple text-white text-sm font-semibold rounded-lg px-5 py-2.5 disabled:opacity-50 hover:bg-brand-purple-dark active:scale-95 transition-all duration-150">
                {loading ? 'Creating...' : 'Launch event'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
