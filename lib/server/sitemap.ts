import { unstable_cache } from 'next/cache';
import { z } from 'zod';
import { upstashRedis } from '@/lib/server/redis';

const SitemapResumeSchema = z.object({
  status: z.enum(['live', 'draft']),
  resumeData: z.unknown().nullish(),
});

async function findLivePrimaryProfileUsernames(): Promise<string[]> {
  let cursor = '0';
  const usernames: string[] = [];

  do {
    const [nextCursor, resumeKeys] = await upstashRedis.scan(cursor, {
      match: 'resume:*',
      count: 100,
    });
    cursor = String(nextCursor);

    if (resumeKeys.length === 0) continue;

    const resumes = await Promise.all(
      resumeKeys.map((key) => upstashRedis.get<unknown>(key)),
    );
    const liveUserIds = resumeKeys.flatMap((key, index) => {
      const parsed = SitemapResumeSchema.safeParse(resumes[index]);
      return parsed.success &&
        parsed.data.status === 'live' &&
        parsed.data.resumeData
        ? [key.slice('resume:'.length)]
        : [];
    });
    const batchUsernames = await Promise.all(
      liveUserIds.map((userId) =>
        upstashRedis.get<string>(`user:id:${userId}`),
      ),
    );
    usernames.push(
      ...batchUsernames.filter(
        (username): username is string => Boolean(username),
      ),
    );
  } while (cursor !== '0');

  return usernames;
}

export const getLivePrimaryProfileUsernames = unstable_cache(
  findLivePrimaryProfileUsernames,
  ['seo-live-primary-profile-usernames'],
  { revalidate: 3600 },
);
