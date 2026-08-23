import { upstashRedis } from '@/lib/server/redis';
import {
  BillingAccountSchema,
  type BillingAccount,
  type PlanId,
} from './types';

const BILLING_PREFIX = 'billing:account:';
const PROCESSED_EVENT_PREFIX = 'billing:event:';
const EVENT_TTL_SECONDS = 60 * 60 * 24 * 400;

const newFreeAccount = (userId: string, now: Date): BillingAccount => ({
  userId,
  source: 'free',
  status: 'none',
  cadence: null,
  creemCustomerId: null,
  creemSubscriptionId: null,
  creemProductId: null,
  currentPeriodStart: null,
  currentPeriodEnd: null,
  graceEndsAt: null,
  trialUsedAt: null,
  pendingCadence: null,
  lastEventAt: 0,
  lastEventId: null,
  manualReviewRequired: false,
  createdAt: now.toISOString(),
  updatedAt: now.toISOString(),
});

export async function getBillingAccount(
  userId: string,
  legacyPlan?: PlanId,
): Promise<BillingAccount> {
  const key = `${BILLING_PREFIX}${userId}`;
  const stored = await upstashRedis.get<BillingAccount>(key);
  if (stored) return BillingAccountSchema.parse(stored);

  const now = new Date();
  const account: BillingAccount =
    legacyPlan === 'pro'
      ? {
          ...newFreeAccount(userId, now),
          source: 'manual',
          status: 'active',
          manualReviewRequired: true,
        }
      : newFreeAccount(userId, now);

  await upstashRedis.setnx(key, account);
  const created = await upstashRedis.get<BillingAccount>(key);
  return BillingAccountSchema.parse(created ?? account);
}

export async function saveBillingAccount(
  account: BillingAccount,
): Promise<BillingAccount> {
  const validated = BillingAccountSchema.parse({
    ...account,
    updatedAt: new Date().toISOString(),
  });
  await upstashRedis.set(`${BILLING_PREFIX}${account.userId}`, validated);
  return validated;
}

export async function claimWebhookEvent(eventId: string): Promise<boolean> {
  const key = `${PROCESSED_EVENT_PREFIX}${eventId}`;
  const claimed = await upstashRedis.setnx(key, new Date().toISOString());
  if (claimed === 1) await upstashRedis.expire(key, EVENT_TTL_SECONDS);
  return claimed === 1;
}

export async function releaseWebhookEvent(eventId: string): Promise<void> {
  await upstashRedis.del(`${PROCESSED_EVENT_PREFIX}${eventId}`);
}
