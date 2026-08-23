'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Summary = {
  account: { source: string; status: string; cadence: string | null; creemCustomerId: string | null; trialUsedAt: string | null; currentPeriodEnd: string | null; graceEndsAt: string | null };
  entitlements: { plan: 'free' | 'pro'; maxProfiles: number; aiGenerationsPerWindow: number };
  quota: { used: number; remaining: number; resetAt: string };
  profileCount: number;
};

export function BillingSummaryCard() {
  const [summary, setSummary] = useState<Summary>();
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetch('/api/billing/account').then((response) => response.ok ? response.json() : undefined).then(setSummary).catch(() => undefined);
  }, []);

  if (!summary) return null;
  const { account, entitlements, quota } = summary;
  const date = (value: string | null) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value)) : null;
  const openPortal = async () => {
    setPortalLoading(true);
    const response = await fetch('/api/billing/portal', { method: 'POST' });
    const result = await response.json();
    if (response.ok && result.url) window.location.assign(result.url);
    else setPortalLoading(false);
  };

  return (
    <section className="rounded-lg border border-neutral-300 bg-white p-4" aria-labelledby="plan-summary">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="plan-summary" className="font-semibold">{entitlements.plan === 'pro' ? 'Pro' : 'Free'} plan</h2>
          <p className="mt-1 text-sm text-neutral-600">
            {summary.profileCount}/{entitlements.maxProfiles} profiles · {quota.used}/{entitlements.aiGenerationsPerWindow} AI generations used
          </p>
          <p className="mt-1 text-xs text-neutral-500">Resets {date(quota.resetAt)}</p>
          {account.status === 'trialing' && <p className="mt-2 text-sm text-blue-700">Trial ends {date(account.currentPeriodEnd)}.</p>}
          {account.status === 'past_due' && <p className="mt-2 text-sm text-amber-700">Payment failed. Pro access remains until {date(account.graceEndsAt)}.</p>}
          {account.status === 'scheduled_cancel' && <p className="mt-2 text-sm text-neutral-700">Pro remains active until {date(account.currentPeriodEnd)}.</p>}
        </div>
        {account.source === 'manual' ? (
          <span className="text-sm text-neutral-600">Managed manually</span>
        ) : account.creemCustomerId && account.status !== 'canceled' && account.status !== 'expired' && account.status !== 'refunded' ? (
          <Button variant="outline" onClick={openPortal} disabled={portalLoading}>{portalLoading ? 'Opening…' : 'Manage billing'}</Button>
        ) : (
          <Button asChild><Link href="/pricing">Upgrade</Link></Button>
        )}
      </div>
    </section>
  );
}
