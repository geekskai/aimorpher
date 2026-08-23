import { randomUUID } from 'crypto';
import { upstashRedis } from '@/lib/server/redis';
import {
  JobProfileSchema,
  type JobProfile,
} from '@/lib/profiles';
import type { ResumeDataSchemaType } from '@/lib/resume';

const PROFILE_PREFIX = 'profile:';
const PROFILE_INDEX_PREFIX = 'profiles:user:';
const LOCK_TTL_SECONDS = 60 * 60 * 24 * 30;

const profileKey = (userId: string, slug: string) =>
  `${PROFILE_PREFIX}${userId}:${slug}`;
const profileIndexKey = (userId: string) => `${PROFILE_INDEX_PREFIX}${userId}`;

const CREATE_PROFILE_SCRIPT = `
local count = tonumber(redis.call('SCARD', KEYS[1]))
if count + 1 >= tonumber(ARGV[1]) then return 0 end
if redis.call('EXISTS', KEYS[2]) == 1 then return -1 end
redis.call('SET', KEYS[2], ARGV[2])
redis.call('SADD', KEYS[1], ARGV[3])
return 1
`;

export type CreateJobProfileInput = {
  userId: string;
  slug: string;
  label: string;
  resumeData: ResumeDataSchemaType;
  maxProfiles: number;
};

export async function createJobProfile(
  input: CreateJobProfileInput,
): Promise<JobProfile> {
  // Redis expires downgraded profiles independently of their set membership.
  // Prune stale members before enforcing the profile limit.
  await listJobProfiles(input.userId);
  const now = new Date().toISOString();
  const profile = JobProfileSchema.parse({
    id: randomUUID(),
    userId: input.userId,
    slug: input.slug,
    label: input.label,
    status: 'draft',
    resumeData: input.resumeData,
    lockedAt: null,
    expiresAt: null,
    createdAt: now,
    updatedAt: now,
  });

  const result = await upstashRedis.eval<unknown[], number>(
    CREATE_PROFILE_SCRIPT,
    [profileIndexKey(input.userId), profileKey(input.userId, input.slug)],
    [input.maxProfiles, JSON.stringify(profile), input.slug],
  );

  if (result === 0) throw new Error('PROFILE_LIMIT_REACHED');
  if (result === -1) throw new Error('PROFILE_SLUG_TAKEN');
  return profile;
}

export async function getJobProfile(
  userId: string,
  slug: string,
): Promise<JobProfile | undefined> {
  const value = await upstashRedis.get<JobProfile>(profileKey(userId, slug));
  return value ? JobProfileSchema.parse(value) : undefined;
}

export async function listJobProfiles(userId: string): Promise<JobProfile[]> {
  const slugs = await upstashRedis.smembers(profileIndexKey(userId));
  if (slugs.length === 0) return [];
  const values = await Promise.all(
    slugs.map((slug) => getJobProfile(userId, String(slug))),
  );
  const staleSlugs = slugs.filter((_, index) => !values[index]);
  if (staleSlugs.length > 0) {
    await upstashRedis.srem(
      profileIndexKey(userId),
      ...staleSlugs.map(String),
    );
  }
  return values
    .filter((profile): profile is JobProfile => Boolean(profile))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function updateJobProfile(
  userId: string,
  slug: string,
  updates: Partial<Pick<JobProfile, 'label' | 'status' | 'resumeData'>>,
): Promise<JobProfile> {
  const current = await getJobProfile(userId, slug);
  if (!current) throw new Error('PROFILE_NOT_FOUND');
  if (current.lockedAt) throw new Error('PROFILE_LOCKED');

  const updated = JobProfileSchema.parse({
    ...current,
    ...updates,
    userId: current.userId,
    slug: current.slug,
    id: current.id,
    updatedAt: new Date().toISOString(),
  });
  await upstashRedis.set(profileKey(userId, slug), updated);
  return updated;
}

export async function deleteJobProfile(
  userId: string,
  slug: string,
): Promise<void> {
  const transaction = upstashRedis.multi();
  transaction.del(profileKey(userId, slug));
  transaction.srem(profileIndexKey(userId), slug);
  await transaction.exec();
}

export async function lockJobProfilesForDowngrade(
  userId: string,
  now = new Date(),
): Promise<void> {
  const profiles = await listJobProfiles(userId);
  const expiresAt = new Date(now.getTime() + LOCK_TTL_SECONDS * 1000);
  await Promise.all(
    profiles.map(async (profile) => {
      if (profile.lockedAt) return;
      const key = profileKey(userId, profile.slug);
      await upstashRedis.set(
        key,
        JobProfileSchema.parse({
          ...profile,
          lockedAt: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
          updatedAt: now.toISOString(),
        }),
      );
      await upstashRedis.expire(key, LOCK_TTL_SECONDS);
    }),
  );
}

export async function restoreJobProfiles(userId: string): Promise<void> {
  const profiles = await listJobProfiles(userId);
  await Promise.all(
    profiles.map(async (profile) => {
      if (!profile.lockedAt) return;
      const key = profileKey(userId, profile.slug);
      await upstashRedis.set(
        key,
        JobProfileSchema.parse({
          ...profile,
          lockedAt: null,
          expiresAt: null,
          updatedAt: new Date().toISOString(),
        }),
      );
      await upstashRedis.persist(key);
    }),
  );
}

export async function deleteAllJobProfiles(userId: string): Promise<void> {
  const slugs = await upstashRedis.smembers(profileIndexKey(userId));
  const transaction = upstashRedis.multi();
  slugs.forEach((slug) => transaction.del(profileKey(userId, String(slug))));
  transaction.del(profileIndexKey(userId));
  await transaction.exec();
}
