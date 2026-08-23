import type { BillingAccount, Entitlements, PlanId } from './types';

export const FREE_ENTITLEMENTS: Entitlements = {
  plan: 'free',
  maxProfiles: 1,
  aiGenerationsPerWindow: 3,
  allowedThemes: ['signal'],
  removeBranding: false,
  profileAnalytics: false,
};

export const PRO_ENTITLEMENTS: Entitlements = {
  plan: 'pro',
  maxProfiles: 5,
  aiGenerationsPerWindow: 30,
  allowedThemes: ['signal', 'studio', 'terminal'],
  removeBranding: true,
  profileAnalytics: true,
};

export const resolvePlan = (
  account: BillingAccount,
  now = new Date(),
): PlanId => {
  if (account.source === 'manual') return 'pro';
  if (account.source !== 'creem') return 'free';

  if (
    account.status === 'trialing' ||
    account.status === 'active' ||
    account.status === 'scheduled_cancel'
  ) {
    return 'pro';
  }

  if (account.status === 'past_due' && account.graceEndsAt) {
    return new Date(account.graceEndsAt) > now ? 'pro' : 'free';
  }

  return 'free';
};

export const resolveEntitlements = (
  account: BillingAccount,
  now = new Date(),
): Entitlements =>
  resolvePlan(account, now) === 'pro'
    ? PRO_ENTITLEMENTS
    : FREE_ENTITLEMENTS;
