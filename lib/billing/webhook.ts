import { createHmac, timingSafeEqual } from 'crypto';
import { getCadenceForProduct } from './creem';
import { resolvePlan } from './entitlements';
import { claimWebhookEvent, getBillingAccount, releaseWebhookEvent, saveBillingAccount } from './repository';
import type { BillingAccount, SubscriptionStatus } from './types';
import { lockJobProfilesForDowngrade, restoreJobProfiles } from '@/lib/server/profileRepository';
import { recordBillingMetric } from '@/lib/server/productMetrics';

type Json = Record<string, unknown>;
const asObject = (value: unknown): Json => value && typeof value === 'object' ? value as Json : {};
const asString = (value: unknown): string | null => typeof value === 'string' && value ? value : null;
const asIso = (value: unknown): string | null => {
  const date = typeof value === 'string' || typeof value === 'number' ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toISOString() : null;
};

export function verifyCreemSignature(rawBody: string, signature: string | null): boolean {
  const environment = process.env.CREEM_ENVIRONMENT === 'live' ? 'LIVE' : 'TEST';
  const secret = process.env[`CREEM_${environment}_WEBHOOK_SECRET`];
  if (!secret || !signature || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = createHmac('sha256', secret).update(rawBody).digest();
  const received = Buffer.from(signature, 'hex');
  return received.length === expected.length && timingSafeEqual(received, expected);
}

const statuses: Record<string, SubscriptionStatus | undefined> = {
  'subscription.trialing': 'trialing',
  'subscription.active': 'active',
  'subscription.paid': 'active',
  'subscription.scheduled_cancel': 'scheduled_cancel',
  'subscription.past_due': 'past_due',
  'subscription.unpaid': 'past_due',
  'subscription.canceled': 'canceled',
  'subscription.expired': 'expired',
  'subscription.paused': 'expired',
  'refund.created': 'refunded',
};

export async function processCreemEvent(payload: unknown): Promise<'processed' | 'duplicate' | 'ignored' | 'out_of_order'> {
  const event = asObject(payload);
  const eventId = asString(event.id);
  const eventType = asString(event.eventType);
  const createdAt = typeof event.created_at === 'number' ? event.created_at : Date.parse(String(event.created_at));
  if (!eventId || !eventType || !Number.isFinite(createdAt)) throw new Error('INVALID_EVENT');
  if (!(await claimWebhookEvent(eventId))) return 'duplicate';

  try {
    const object = asObject(event.object);
    const metadata = asObject(object.metadata);
    const subscription = object.object === 'subscription' ? object : asObject(object.subscription);
    const subscriptionMetadata = asObject(subscription.metadata);
    const userId = asString(metadata.userId) ?? asString(subscriptionMetadata.userId) ?? asString(object.request_id);
    if (!userId) return 'ignored';

    const product = asObject(subscription.product);
    const items = Array.isArray(subscription.items) ? subscription.items.map(asObject) : [];
    const productId = asString(product.id) ?? asString(subscription.product) ?? asString(items[0]?.product_id) ?? asString(object.product_id);
    const cadence = productId ? getCadenceForProduct(productId) : null;
    if (!cadence) return 'ignored';

    const current = await getBillingAccount(userId);
    if (createdAt <= current.lastEventAt) return 'out_of_order';
    const updateStatuses: Record<string, SubscriptionStatus | undefined> = {
      trialing: 'trialing', active: 'active', scheduled_cancel: 'scheduled_cancel',
      past_due: 'past_due', unpaid: 'past_due', canceled: 'canceled',
      expired: 'expired', paused: 'expired',
    };
    const nextStatus = eventType === 'subscription.update'
      ? updateStatuses[asString(subscription.status) ?? '']
      : statuses[eventType];
    if (!nextStatus) return 'ignored';
    if (nextStatus === 'trialing' && (cadence !== 'monthly' || current.trialUsedAt)) return 'ignored';
    const now = new Date(createdAt);
    const graceEndsAt = nextStatus === 'past_due' ? new Date(createdAt + 3 * 86400000).toISOString() : null;
    const customer = asObject(subscription.customer);
    const next: BillingAccount = {
      ...current,
      source: 'creem',
      status: nextStatus,
      cadence,
      creemCustomerId: asString(customer.id) ?? asString(subscription.customer) ?? current.creemCustomerId,
      creemSubscriptionId: asString(subscription.id) ?? current.creemSubscriptionId,
      creemProductId: productId,
      currentPeriodStart: asIso(subscription.current_period_start_date) ?? current.currentPeriodStart,
      currentPeriodEnd: asIso(subscription.current_period_end_date) ?? current.currentPeriodEnd,
      graceEndsAt,
      trialUsedAt: nextStatus === 'trialing' ? current.trialUsedAt ?? now.toISOString() : current.trialUsedAt,
      lastEventAt: createdAt,
      lastEventId: eventId,
    };
    const hadPro = resolvePlan(current, now) === 'pro';
    const hasPro = resolvePlan(next, now) === 'pro';
    await saveBillingAccount(next);
    if (!hadPro && hasPro) await restoreJobProfiles(userId);
    if (hadPro && !hasPro) await lockJobProfilesForDowngrade(userId, now);
    if (nextStatus === 'trialing') await recordBillingMetric('trial_start', cadence);
    if (current.status === 'trialing' && nextStatus === 'active') await recordBillingMetric('trial_convert', cadence);
    if (current.status === 'trialing' && ['scheduled_cancel', 'canceled', 'expired'].includes(nextStatus)) await recordBillingMetric('trial_cancel', cadence);
    if (nextStatus === 'past_due') await recordBillingMetric('payment_failure', cadence);
    if (hadPro && !hasPro) await recordBillingMetric('downgrade', cadence);
    return 'processed';
  } catch (error) {
    await releaseWebhookEvent(eventId);
    throw error;
  }
}
