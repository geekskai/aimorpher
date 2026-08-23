'use client';

import { useFunnelAnalytics } from '@/hooks/useFunnelAnalytics';
import { useUser } from '@clerk/nextjs';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';

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
  const { isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<{ source: string; status: string; cadence: string | null; trialUsedAt: string | null; creemCustomerId: string | null }>();

  useEffect(() => {
    if (isSignedIn) fetch('/api/billing/account').then((response) => response.ok ? response.json() : undefined).then((result) => setAccount(result?.account)).catch(() => undefined);
  }, [isSignedIn]);

  const manageStatuses = ['trialing', 'active', 'scheduled_cancel', 'past_due'];
  const shouldManage = Boolean(account?.creemCustomerId && manageStatuses.includes(account.status));

  const startCheckout = async () => {
    if (!isSignedIn) {
      plausible('checkout_started', { props: { billing_period: billingPeriod } });
      window.location.assign(`/upload?intent=pro&billing=${billingPeriod}`);
      return;
    }
    if (!shouldManage) plausible('checkout_started', { props: { billing_period: billingPeriod } });
    if (account?.source === 'manual') {
      toast.info('Your Pro access is managed manually.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(shouldManage ? '/api/billing/portal' : '/api/billing/checkout', shouldManage ? { method: 'POST' } : {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cadence: billingPeriod }),
      });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error ?? 'Checkout unavailable');
      window.location.assign(result.url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Checkout unavailable');
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      className={className}
      onClick={startCheckout}
    >
      {loading ? 'Opening…' : account?.source === 'manual' ? 'Pro active' : account?.status === 'past_due' ? 'Fix payment' : account?.status === 'scheduled_cancel' ? 'Manage cancellation' : account?.status === 'trialing' ? 'Manage trial' : shouldManage ? 'Manage billing' : billingPeriod === 'monthly' && account?.trialUsedAt ? 'Choose monthly · $12/month' : children}
    </button>
  );
}
