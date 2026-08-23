'use client';

import type { AccountPlan } from '@/lib/server/redisActions';
import { BarChart3, LockKeyhole } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function ProfileAnalyticsCard({ plan }: { plan: AccountPlan }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    if (plan !== 'pro') return;

    fetch('/api/profile-analytics')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setViews(typeof data?.views === 'number' ? data.views : 0))
      .catch(() => setViews(0));
  }, [plan]);

  if (plan !== 'pro') {
    return (
      <Link
        href="/pricing"
        className="flex items-center gap-3 rounded-lg border border-dashed border-neutral-300 bg-white px-4 py-3 text-sm transition-colors hover:border-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
      >
        <LockKeyhole className="size-4" aria-hidden="true" />
        <span className="flex-1">Profile views are available with Pro.</span>
        <span className="font-semibold">See Pro</span>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm">
      <BarChart3 className="size-4" aria-hidden="true" />
      <span className="text-design-gray">Profile views</span>
      <strong className="ml-auto text-base tabular-nums">{views ?? '—'}</strong>
    </div>
  );
}
