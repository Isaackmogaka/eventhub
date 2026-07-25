'use client';

import { useRequireAuth } from '@/lib/hooks';

export default function NewEventPage() {
  const { user, checked } = useRequireAuth();

  if (!checked) return null;

  if (user?.role !== 'ORGANIZER') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-3">
        <p className="text-sm text-gray-600">Only organizers can create events.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create an event</h1>
        <p className="text-sm text-gray-600">Form goes here — next chunk.</p>
      </div>
    </div>
  );
}
