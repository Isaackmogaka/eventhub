'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithGoogle } from '@/lib/api';
import { saveSession } from '@/lib/auth';
import { useToast } from '@/lib/toast/ToastContext';

declare global {
  interface Window {
    google: any;
  }
}

export function GoogleButton() {
  const router = useRouter();
  const { showToast } = useToast();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.google?.accounts?.id) {
      initializeGoogle();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = initializeGoogle;
    document.body.appendChild(script);

    function initializeGoogle() {
      if (!window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response: { credential: string }) => {
          try {
            const data = await loginWithGoogle(response.credential);
            saveSession(data.token, data.user);
            router.push('/dashboard');
          } catch (err) {
            showToast(err instanceof Error ? err.message : 'Google sign-in failed', 'error');
          }
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'continue_with',
      });
    }

    return () => {};
  }, []);

  return <div ref={buttonRef} className="flex justify-center" />;
}
