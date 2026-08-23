import { resolvePlan } from './entitlements';
import type { BillingAccount } from './types';
import { lockJobProfilesForDowngrade } from '@/lib/server/profileRepository';

export async function enforceExpiredGracePeriod(
  account: BillingAccount,
  now = new Date(),
): Promise<void> {
  if (
    account.source === 'creem' &&
    account.status === 'past_due' &&
    resolvePlan(account, now) === 'free'
  ) {
    await lockJobProfilesForDowngrade(account.userId, now);
  }
}
