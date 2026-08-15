'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyProfile } from './api';
import { getUser, saveSession, clearSession } from './auth';
import { logoutUser } from './api';

export function useRequireAuth() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string; name: string; role: string } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((profile) => {
        const u = { id: profile.id, email: profile.email, name: profile.name, role: profile.role };
        saveSession(u);
        setUser(u);
        setChecked(true);
      })
      .catch(() => {
        clearSession();
        router.push('/login');
      });
  }, [router]);

  async function logout() {
    await logoutUser();
    clearSession();
    router.push('/login');
  }

  return { user, checked, logout };
}
