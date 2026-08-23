import { createHmac } from 'crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { processCreemEvent, verifyCreemSignature } from '@/lib/billing/webhook';
import { claimWebhookEvent, getBillingAccount, saveBillingAccount } from '@/lib/billing/repository';
import { lockJobProfilesForDowngrade } from '@/lib/server/profileRepository';

vi.mock('@/lib/billing/repository', () => ({
  claimWebhookEvent: vi.fn(), getBillingAccount: vi.fn(), releaseWebhookEvent: vi.fn(), saveBillingAccount: vi.fn(),
}));
vi.mock('@/lib/server/profileRepository', () => ({
  lockJobProfilesForDowngrade: vi.fn(), restoreJobProfiles: vi.fn(),
}));
vi.mock('@/lib/server/productMetrics', () => ({ recordBillingMetric: vi.fn() }));

describe('Creem webhook signature', () => {
  const previous = process.env.CREEM_TEST_WEBHOOK_SECRET;
  afterEach(() => { process.env.CREEM_TEST_WEBHOOK_SECRET = previous; });

  it('accepts only the HMAC of the raw body', () => {
    process.env.CREEM_ENVIRONMENT = 'test';
    process.env.CREEM_TEST_WEBHOOK_SECRET = 'test-secret';
    const body = '{"id":"evt_1"}';
    const signature = createHmac('sha256', 'test-secret').update(body).digest('hex');
    expect(verifyCreemSignature(body, signature)).toBe(true);
    expect(verifyCreemSignature(`${body} `, signature)).toBe(false);
    expect(verifyCreemSignature(body, 'bad')).toBe(false);
  });
});

describe('Creem webhook lifecycle', () => {
  const baseAccount = {
    userId: 'user_1', source: 'creem', status: 'active', cadence: 'monthly',
    creemCustomerId: 'cust_1', creemSubscriptionId: 'sub_1', creemProductId: 'prod_month',
    currentPeriodStart: null, currentPeriodEnd: null, graceEndsAt: null, trialUsedAt: null,
    pendingCadence: null, lastEventAt: 1000, lastEventId: 'evt_old', manualReviewRequired: false,
    createdAt: '2026-08-01T00:00:00.000Z', updatedAt: '2026-08-01T00:00:00.000Z',
  } as const;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CREEM_ENVIRONMENT = 'test';
    process.env.CREEM_TEST_MONTHLY_PRODUCT_ID = 'prod_month';
    vi.mocked(claimWebhookEvent).mockResolvedValue(true);
    vi.mocked(getBillingAccount).mockResolvedValue(baseAccount);
    vi.mocked(saveBillingAccount).mockImplementation(async (value) => value);
  });

  it('is idempotent by event ID', async () => {
    vi.mocked(claimWebhookEvent).mockResolvedValue(false);
    await expect(processCreemEvent({ id: 'evt_1', eventType: 'subscription.paid', created_at: 2000 })).resolves.toBe('duplicate');
    expect(saveBillingAccount).not.toHaveBeenCalled();
  });

  it('rejects older events from overwriting current state', async () => {
    await expect(processCreemEvent({ id: 'evt_1', eventType: 'subscription.canceled', created_at: 999, object: { object: 'subscription', product: 'prod_month', metadata: { userId: 'user_1' } } })).resolves.toBe('out_of_order');
    expect(saveBillingAccount).not.toHaveBeenCalled();
  });

  it('starts a three-day grace period for failed payments', async () => {
    await expect(processCreemEvent({ id: 'evt_2', eventType: 'subscription.past_due', created_at: 2000, object: { id: 'sub_1', object: 'subscription', product: 'prod_month', metadata: { userId: 'user_1' } } })).resolves.toBe('processed');
    expect(saveBillingAccount).toHaveBeenCalledWith(expect.objectContaining({ status: 'past_due', graceEndsAt: '1970-01-04T00:00:02.000Z' }));
    expect(lockJobProfilesForDowngrade).not.toHaveBeenCalled();
  });

  it('revokes and locks versions after cancellation', async () => {
    await processCreemEvent({ id: 'evt_3', eventType: 'subscription.canceled', created_at: 2000, object: { id: 'sub_1', object: 'subscription', product: 'prod_month', metadata: { userId: 'user_1' } } });
    expect(lockJobProfilesForDowngrade).toHaveBeenCalledWith('user_1', new Date(2000));
  });

  it('ignores unknown Product IDs without granting access', async () => {
    await expect(processCreemEvent({ id: 'evt_4', eventType: 'subscription.paid', created_at: 2000, object: { object: 'subscription', product: 'prod_unknown', metadata: { userId: 'user_1' } } })).resolves.toBe('ignored');
    expect(saveBillingAccount).not.toHaveBeenCalled();
  });
});
