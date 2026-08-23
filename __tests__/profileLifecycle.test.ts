import { beforeEach, describe, expect, it, vi } from 'vitest';
import { upstashRedis } from '@/lib/server/redis';
import { lockJobProfilesForDowngrade, restoreJobProfiles } from '@/lib/server/profileRepository';

vi.mock('@/lib/server/redis', () => ({
  upstashRedis: { smembers: vi.fn(), get: vi.fn(), set: vi.fn(), expire: vi.fn(), persist: vi.fn(), srem: vi.fn() },
}));

const profile = {
  id: '1bd7e730-29f6-47eb-9e2f-cff4fd12b843', userId: 'user_1', slug: 'design-role', label: 'Design role', status: 'live',
  resumeData: { profileVersion: 1, themeId: 'signal', visibility: { email: true, phone: true, location: true, education: true, resumeDownload: false }, profileBlocks: { projects: [], links: [], resumeDownloadUrl: null }, header: { name: 'Ada', shortAbout: 'Engineer', contacts: {}, skills: [] }, summary: 'Summary', workExperience: [], education: [] },
  lockedAt: null, expiresAt: null, createdAt: '2026-08-01T00:00:00.000Z', updatedAt: '2026-08-01T00:00:00.000Z',
} as const;

describe('downgrade profile lifecycle', () => {
  beforeEach(() => { vi.clearAllMocks(); vi.mocked(upstashRedis.smembers).mockResolvedValue(['design-role'] as never); });

  it('makes versions private for exactly 30 days without losing publish state', async () => {
    vi.mocked(upstashRedis.get).mockResolvedValue(profile as never);
    await lockJobProfilesForDowngrade('user_1', new Date('2026-08-23T00:00:00.000Z'));
    expect(upstashRedis.set).toHaveBeenCalledWith('profile:user_1:design-role', expect.objectContaining({ status: 'live', lockedAt: '2026-08-23T00:00:00.000Z', expiresAt: '2026-09-22T00:00:00.000Z' }));
    expect(upstashRedis.expire).toHaveBeenCalledWith('profile:user_1:design-role', 2592000);
  });

  it('restores a locked version and removes its TTL', async () => {
    vi.mocked(upstashRedis.get).mockResolvedValue({ ...profile, lockedAt: '2026-08-23T00:00:00.000Z', expiresAt: '2026-09-22T00:00:00.000Z' } as never);
    await restoreJobProfiles('user_1');
    expect(upstashRedis.set).toHaveBeenCalledWith('profile:user_1:design-role', expect.objectContaining({ status: 'live', lockedAt: null, expiresAt: null }));
    expect(upstashRedis.persist).toHaveBeenCalledWith('profile:user_1:design-role');
  });
});
