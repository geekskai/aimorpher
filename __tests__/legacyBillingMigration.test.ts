import { beforeEach, describe, expect, it, vi } from 'vitest';
import { upstashRedis } from '@/lib/server/redis';
import { getResume } from '@/lib/server/redisActions';

vi.mock('@/lib/server/redis', () => ({
  upstashRedis: { get: vi.fn(), set: vi.fn(), setnx: vi.fn() },
}));

describe('legacy resume billing migration', () => {
  beforeEach(() => vi.clearAllMocks());

  it('moves legacy Pro to a manual BillingAccount and removes plan from profile content', async () => {
    const legacyResume = { plan: 'pro', status: 'live', resumeData: null };
    vi.mocked(upstashRedis.get)
      .mockResolvedValueOnce(legacyResume as never)
      .mockResolvedValueOnce(null as never)
      .mockResolvedValueOnce({
        userId: 'user_1', source: 'manual', status: 'active', cadence: null,
        creemCustomerId: null, creemSubscriptionId: null, creemProductId: null,
        currentPeriodStart: null, currentPeriodEnd: null, graceEndsAt: null,
        trialUsedAt: null, pendingCadence: null, lastEventAt: 0, lastEventId: null,
        manualReviewRequired: true, createdAt: '2026-08-23T00:00:00.000Z', updatedAt: '2026-08-23T00:00:00.000Z',
      } as never);
    vi.mocked(upstashRedis.setnx).mockResolvedValue(1 as never);

    await expect(getResume('user_1')).resolves.toMatchObject({ plan: 'pro', status: 'live' });
    expect(upstashRedis.setnx).toHaveBeenCalledWith('billing:account:user_1', expect.objectContaining({ source: 'manual', manualReviewRequired: true }));
    expect(upstashRedis.set).toHaveBeenCalledWith('resume:user_1', { status: 'live', resumeData: null });
  });
});
