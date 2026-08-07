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
  latitude?: number;
  longitude?: number;
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

export async function cancelHold(holdId: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/events/holds/${holdId}/cancel`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to cancel reservation');
  return json;
}

export async function payWithMpesa(holdId: string, phoneNumber: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/payments/${holdId}/pay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ phoneNumber }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to initiate payment');
  return json;
}

export async function getPaymentStatus(holdId: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/payments/${holdId}/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to check payment status');
  return json;
}

export async function getMyTickets() {
  const token = getToken();
  const res = await fetch(`${API_URL}/tickets/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load tickets');
  return res.json();
}

export async function getMyProfile() {
  const token = getToken();

  const res = await fetch(`${API_URL}/profile/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || 'Failed to load profile');
  }

  return json;
}

export async function updateMyProfile(data: {
  name?: string;
  phone?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
}) {
  const token = getToken();

  const res = await fetch(`${API_URL}/profile/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || 'Failed to update profile');
  }

  return json;
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const token = getToken();

  const res = await fetch(`${API_URL}/profile/me/password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || 'Failed to change password');
  }

  return json;
}

export async function getAdminStats() {
  const token = getToken();
  const res = await fetch(`${API_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load stats');
  return res.json();
}

export async function getAdminUsers() {
  const token = getToken();
  const res = await fetch(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
}

export async function getAdminEvents() {
  const token = getToken();
  const res = await fetch(`${API_URL}/admin/events`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load events');
  return res.json();
}

export async function updateEventStatus(eventId: string, status: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/admin/events/${eventId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update event status');
  return res.json();
}

export async function getAdminPayments() {
  const token = getToken();
  const res = await fetch(`${API_URL}/admin/payments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load payments');
  return res.json();
}

export async function checkInTicket(qrCode: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/tickets/check-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ qrCode }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Check-in failed');
  return json;
}

export async function updateEvent(id: string, data: any) {
  const token = getToken();
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update event');
  return json;
}

export async function getTicketSummary() {
  const token = getToken();
  const res = await fetch(`${API_URL}/tickets/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load ticket summary');
  return res.json();
}
