import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FREE_ENTITLEMENTS, PRO_ENTITLEMENTS } from '@/lib/billing/entitlements';
import { commitGeneration, getGenerationQuota, releaseGeneration, reserveGeneration } from '@/lib/billing/quota';
import { upstashRedis } from '@/lib/server/redis';

vi.mock('@/lib/server/redis', () => ({ upstashRedis: { eval: vi.fn() } }));

describe('generation quota reservations', () => {
  beforeEach(() => vi.clearAllMocks());

  it('reports a 30-day reset and does not reset usage when the plan upgrades', async () => {
    vi.mocked(upstashRedis.eval).mockResolvedValue([2, 0, 1788134400] as never);
    const free = await getGenerationQuota('user_1', FREE_ENTITLEMENTS);
    const pro = await getGenerationQuota('user_1', PRO_ENTITLEMENTS);
    expect(free).toMatchObject({ used: 2, remaining: 1, limit: 3 });
    expect(pro).toMatchObject({ used: 2, remaining: 28, limit: 30 });
    expect(pro.resetAt).toBe(free.resetAt);
  });

  it('returns null when used plus pending reaches the limit', async () => {
    vi.mocked(upstashRedis.eval).mockResolvedValue([0, 2, 1, 1788134400] as never);
    await expect(reserveGeneration('user_1', FREE_ENTITLEMENTS)).resolves.toBeNull();
  });

  it('commits successful reservations and releases failed ones', async () => {
    vi.mocked(upstashRedis.eval).mockResolvedValueOnce([1, 1, 1, 1788134400] as never).mockResolvedValueOnce(1 as never).mockResolvedValueOnce(1 as never);
    const reservation = await reserveGeneration('user_1', FREE_ENTITLEMENTS);
    expect(reservation?.quota).toMatchObject({ used: 1, pending: 1, remaining: 1 });
    await expect(commitGeneration('user_1', reservation!.token)).resolves.toBe(true);
    await expect(releaseGeneration('user_1', reservation!.token)).resolves.toBeUndefined();
  });
});
