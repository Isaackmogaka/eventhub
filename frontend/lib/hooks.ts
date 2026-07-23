'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, getUser, clearSession } from './auth';

export function useRequireAuth() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string; name: string; role: string } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = getToken();
    const storedUser = getUser();
    if (!token || !storedUser) {
      router.push('/login');
      return;
    }
    setUser(storedUser);
    setChecked(true);
  }, [router]);

  function logout() {
    clearSession();
    router.push('/login');
  }

  return { user, checked, logout };
}
