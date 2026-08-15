const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function registerUser(data: { email: string; password: string; name: string; role: string }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    credentials: 'include',
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
    credentials: 'include',
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
  const res = await fetch(`${API_URL}/events`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create event');
  return json;
}

export async function createHold(eventId: string, quantity: number) {
  const res = await fetch(`${API_URL}/events/${eventId}/hold`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to reserve ticket');
  return json;
}

export async function cancelHold(holdId: string) {
  const res = await fetch(`${API_URL}/events/holds/${holdId}/cancel`, {
    credentials: 'include',
    method: 'POST',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to cancel reservation');
  return json;
}

export async function payWithMpesa(holdId: string, phoneNumber: string) {
  const res = await fetch(`${API_URL}/payments/${holdId}/pay`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phoneNumber }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to initiate payment');
  return json;
}

export async function getPaymentStatus(holdId: string) {
  const res = await fetch(`${API_URL}/payments/${holdId}/status`, {
    credentials: 'include',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to check payment status');
  return json;
}

export async function getMyTickets() {
  const res = await fetch(`${API_URL}/tickets/mine`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to load tickets');
  return res.json();
}

export async function getMyProfile() {

  const res = await fetch(`${API_URL}/profile/me`, {
    credentials: 'include',
    headers: {
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

  const res = await fetch(`${API_URL}/profile/me`, {
    credentials: 'include',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
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

  const res = await fetch(`${API_URL}/profile/me/password`, {
    credentials: 'include',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
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
  const res = await fetch(`${API_URL}/admin/stats`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to load stats');
  return res.json();
}

export async function getAdminUsers() {
  const res = await fetch(`${API_URL}/admin/users`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
}

export async function getAdminEvents() {
  const res = await fetch(`${API_URL}/admin/events`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to load events');
  return res.json();
}

export async function updateEventStatus(eventId: string, status: string) {
  const res = await fetch(`${API_URL}/admin/events/${eventId}/status`, {
    credentials: 'include',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update event status');
  return res.json();
}

export async function getAdminPayments() {
  const res = await fetch(`${API_URL}/admin/payments`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to load payments');
  return res.json();
}

export async function checkInTicket(qrCode: string) {
  const res = await fetch(`${API_URL}/tickets/check-in`, {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qrCode }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Check-in failed');
  return json;
}

export async function updateEvent(id: string, data: any) {
  const res = await fetch(`${API_URL}/events/${id}`, {
    credentials: 'include',
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update event');
  return json;
}

export async function getTicketSummary() {
  const res = await fetch(`${API_URL}/tickets/summary`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to load ticket summary');
  return res.json();
}

export async function setPayoutNumber(phoneNumber: string) {
  const res = await fetch(`${API_URL}/profile/payout-number`, {
    credentials: 'include',
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to save payout number');
  return json;
}

export async function requestPasswordReset(email: string) {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function resetPassword(token: string, newPassword: string) {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to reset password');
  return json;
}

export async function loginWithGoogle(credential: string) {
  const res = await fetch(`${API_URL}/auth/google`, {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Google sign-in failed');
  return json;
}

export async function logoutUser() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  return res.json();
}
