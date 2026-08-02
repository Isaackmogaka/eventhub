'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SidebarProps {
  active: 'dashboard' | 'my-tickets' | 'profile' | 'admin';
  isAdmin?: boolean;
  onLogout: () => void;
}

const baseNavItems = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { key: 'my-tickets', label: 'My Tickets', href: '/my-tickets' },
  { key: 'profile', label: 'Profile', href: '/profile' },
] as const;

export function Sidebar({ active, onLogout, isAdmin }: SidebarProps) {
  const [open, setOpen] = useState(false);

  const navItems = isAdmin
    ? [...baseNavItems, { key: 'admin' as const, label: 'Management', href: '/admin' }]
    : baseNavItems;

  const content = (
    <>
      <Link href="/" className="flex items-center gap-2 px-2 pb-6">
        <div className="w-9 h-9 rounded-lg bg-brand-purple flex items-center justify-center font-bold text-sm">E</div>
        <div>
          <p className="font-bold text-sm">EventHub</p>
          <p className="text-xs text-gray-400">Event Management</p>
        </div>
      </Link>
      <nav className="flex-1 flex flex-col gap-1 text-sm">
        {navItems.map((item) =>
          item.key === active ? (
            <span key={item.key} className="bg-brand-purple rounded-lg px-3 py-2.5 font-semibold">
              {item.label}
            </span>
          ) : (
            <Link key={item.key} href={item.href} className="px-3 py-2.5 text-gray-300 rounded-lg">
              {item.label}
            </Link>
          )
        )}
      </nav>
      <button onClick={onLogout} className="text-left text-sm text-gray-300 px-3 py-2.5 hover:text-white">
        Logout
      </button>
    </>
  );

  return (
    <>
      {/* Mobile top bar with hamburger toggle */}
      <div className="md:hidden flex items-center justify-between bg-brand-navy text-white px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center font-bold text-sm">E</div>
          <span className="font-bold text-sm">EventHub</span>
        </Link>
        <button onClick={() => setOpen(!open)} className="text-2xl leading-none">
          {open ? '\u2715' : '\u2630'}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="md:hidden bg-brand-navy text-white px-4 pb-4 flex flex-col gap-1 text-sm">
          {navItems.map((item) =>
            item.key === active ? (
              <span key={item.key} className="bg-brand-purple rounded-lg px-3 py-2.5 font-semibold">
                {item.label}
              </span>
            ) : (
              <Link key={item.key} href={item.href} className="px-3 py-2.5 text-gray-300 rounded-lg" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            )
          )}
          <button onClick={onLogout} className="text-left px-3 py-2.5 text-gray-300">
            Logout
          </button>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-brand-navy text-white p-4 flex-col flex-shrink-0">
        {content}
      </aside>
    </>
  );
}
