'use client';

import { useEffect } from 'react';

export function ProfileViewTracker({ username, versionSlug }: { username: string; versionSlug?: string }) {
  useEffect(() => {
    const sessionKey = `aimorpher:profile-view:${username}:${versionSlug ?? 'primary'}`;
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, 'true');

    const body = JSON.stringify({ username, versionSlug });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        '/api/profile-view',
        new Blob([body], { type: 'application/json' }),
      );
      return;
    }

    fetch('/api/profile-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => undefined);
  }, [username, versionSlug]);

  return null;
}
