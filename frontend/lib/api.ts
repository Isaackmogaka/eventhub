import { getToken } from './auth';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function registerUser(data: { email: string; password: string; name: string; role: string }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Registration failed');
  return json;
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Login failed');
  return json;
}

export async function getEvents() {
  const res = await fetch(`${API_URL}/events`);
  return res.json();
}

export async function getEvent(id: string) {
  const res = await fetch(`${API_URL}/events/${id}`);
  if (!res.ok) throw new Error('Event not found');
  return res.json();
}

export async function createEvent(data: {
  title: string;
  description?: string;
  category?: string;
  location?: string;
  isOnline: boolean;
  startsAt: string;
  priceCents: number;
  totalTickets: number;
}) {
  const token = getToken();
  const res = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create event');
  return json;
}

export async function createHold(eventId: string, quantity: number) {
  const token = getToken();
  const res = await fetch(`${API_URL}/events/${eventId}/hold`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to reserve ticket');
  return json;
}
