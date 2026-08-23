import { describe, expect, it } from 'vitest';
import { resolveEntitlements, resolvePlan } from '@/lib/billing/entitlements';
import type { BillingAccount } from '@/lib/billing/types';

const account = (overrides: Partial<BillingAccount> = {}): BillingAccount => ({
  userId: 'user_1', source: 'free', status: 'none', cadence: null,
  creemCustomerId: null, creemSubscriptionId: null, creemProductId: null,
  currentPeriodStart: null, currentPeriodEnd: null, graceEndsAt: null,
  trialUsedAt: null, pendingCadence: null, lastEventAt: 0, lastEventId: null,
  manualReviewRequired: false, createdAt: '2026-08-01T00:00:00.000Z', updatedAt: '2026-08-01T00:00:00.000Z',
  ...overrides,
});

describe('billing entitlements', () => {
  it.each(['trialing', 'active', 'scheduled_cancel'] as const)('keeps Pro for %s', (status) => {
    expect(resolvePlan(account({ source: 'creem', status }))).toBe('pro');
  });

  it('keeps Pro during the three-day payment grace period then downgrades', () => {
    const pastDue = account({ source: 'creem', status: 'past_due', graceEndsAt: '2026-08-04T00:00:00.000Z' });
    expect(resolvePlan(pastDue, new Date('2026-08-03T23:59:59.000Z'))).toBe('pro');
    expect(resolvePlan(pastDue, new Date('2026-08-04T00:00:00.000Z'))).toBe('free');
  });

  it('preserves migrated manual Pro accounts for review', () => {
    expect(resolvePlan(account({ source: 'manual', status: 'active', manualReviewRequired: true }))).toBe('pro');
  });

  it('exposes the fixed Free and Pro limits', () => {
    expect(resolveEntitlements(account())).toMatchObject({ maxProfiles: 1, aiGenerationsPerWindow: 3 });
    expect(resolveEntitlements(account({ source: 'creem', status: 'active' }))).toMatchObject({ maxProfiles: 5, aiGenerationsPerWindow: 30 });
  });
});
