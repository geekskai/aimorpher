'use client';

import { useFunnelAnalytics } from '@/hooks/useFunnelAnalytics';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function PaidPilotLink({
  billingPeriod,
  children,
  className,
}: {
  billingPeriod: 'monthly' | 'annual';
  children: ReactNode;
  className?: string;
}) {
  const plausible = useFunnelAnalytics();

  return (
    <Link
      href={`/upload?intent=pro&billing=${billingPeriod}`}
      className={className}
      onClick={() =>
        plausible('paid_pilot_clicked', { props: { billing_period: billingPeriod } })
      }
    >
      {children}
    </Link>
  );
}
