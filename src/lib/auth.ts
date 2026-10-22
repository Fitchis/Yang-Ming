'use client';

import { useState, useEffect } from 'react';

export interface UserSession {
  user: {
    id: string;
    email: string;
    companyName: string;
  };
  loggedInAt: string;
}

const SESSION_KEY = 'yangming_session';

export function getSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.user && parsed.user.email) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Error reading session:', error);
    return null;
  }
}

export function setSession(session: UserSession): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    // Also set a cookie for fast client/server awareness
    document.cookie = `yangming_session_active=1; path=/; max-age=86400; SameSite=Lax`;
    window.dispatchEvent(new Event('yangming_session_updated'));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(SESSION_KEY);
    document.cookie = `yangming_session_active=; path=/; max-age=0; SameSite=Lax`;
    window.dispatchEvent(new Event('yangming_session_updated'));
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}

export function useSession() {
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial read
    const current = getSession();
    setSessionState(current);
    setLoading(false);

    const handleUpdate = () => {
      setSessionState(getSession());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('yangming_session_updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('yangming_session_updated', handleUpdate);
    };
  }, []);

  return {
    session,
    isAuthenticated: !!session,
    loading,
    logout: clearSession,
  };
}
