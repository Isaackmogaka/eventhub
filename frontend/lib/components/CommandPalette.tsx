'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { getUser } from '@/lib/auth';
import { getEvents } from '@/lib/api';

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  action: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [events, setEvents] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      getEvents().then((data) => setEvents(data.slice(0, 5)));
    }
  }, [open]);

  const go = useCallback(
    (path: string) => {
      router.push(path);
      setOpen(false);
      setQuery('');
    },
    [router]
  );

  const user = getUser();

  const navCommands: CommandItem[] = [
    { id: 'home', label: 'Browse events', hint: 'Home', action: () => go('/') },
    { id: 'dashboard', label: 'Go to Dashboard', action: () => go('/dashboard') },
    { id: 'tickets', label: 'My Tickets', action: () => go('/my-tickets') },
    { id: 'profile', label: 'Profile', action: () => go('/profile') },
    ...(user?.role === 'ADMIN'
      ? [{ id: 'admin', label: 'Management', hint: 'Admin', action: () => go('/admin') }]
      : []),
    ...(user?.role === 'ORGANIZER'
      ? [{ id: 'new-event', label: 'Create Event', action: () => go('/events/new') }]
      : []),
  ];

  const eventCommands: CommandItem[] = events.map((e) => ({
    id: e.id,
    label: e.title,
    hint: 'Event',
    action: () => go(`/events/${e.id}`),
  }));

  const filtered = [...navCommands, ...eventCommands].filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events or jump to a page..."
            className="w-full px-4 py-4 text-sm outline-none border-b border-gray-100"
          />
          <div className="max-h-80 overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <p className="px-4 py-6 text-sm text-gray-400 text-center">No results found.</p>
            ) : (
              filtered.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-brand-purple-light transition-colors"
                >
                  <span className="text-gray-900">{cmd.label}</span>
                  {cmd.hint && <span className="text-xs text-gray-400">{cmd.hint}</span>}
                </button>
              ))
            )}
          </div>
          <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-3">
            <span><kbd className="bg-white border border-gray-200 rounded px-1.5 py-0.5">Esc</kbd> to close</span>
            <span><kbd className="bg-white border border-gray-200 rounded px-1.5 py-0.5">&#8984;K</kbd> to toggle</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
