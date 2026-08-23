'use client';

import { useFunnelAnalytics } from '@/hooks/useFunnelAnalytics';
import { useEffect, useRef } from 'react';

export function PricingAnalytics() {
  const plausible = useFunnelAnalytics();
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    plausible('upgrade_viewed', { props: { source: 'pricing' } });
  }, [plausible]);

  return null;
}
