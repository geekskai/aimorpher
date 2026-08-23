import { randomUUID } from 'crypto';
import { upstashRedis } from '@/lib/server/redis';
import type { Entitlements } from './types';

const WINDOW_SECONDS = 60 * 60 * 24 * 30;
const RESERVATION_SECONDS = 60 * 5;

const quotaKey = (userId: string) => `quota:ai:${userId}`;
const pendingKey = (userId: string) => `quota:ai:${userId}:pending`;

export type GenerationQuota = {
  used: number;
  pending: number;
  limit: number;
  remaining: number;
  resetAt: string;
};

const RESERVE_SCRIPT = `
local now = tonumber(ARGV[1])
local resetAt = tonumber(redis.call('HGET', KEYS[1], 'resetAt') or '0')
if resetAt <= now then
  redis.call('DEL', KEYS[1])
  redis.call('DEL', KEYS[2])
  resetAt = now + tonumber(ARGV[2])
  redis.call('HSET', KEYS[1], 'used', 0, 'resetAt', resetAt)
end
redis.call('ZREMRANGEBYSCORE', KEYS[2], '-inf', now)
local used = tonumber(redis.call('HGET', KEYS[1], 'used') or '0')
local pending = tonumber(redis.call('ZCARD', KEYS[2]))
local limit = tonumber(ARGV[3])
if used + pending >= limit then
  return {0, used, pending, resetAt}
end
redis.call('ZADD', KEYS[2], now + tonumber(ARGV[4]), ARGV[5])
redis.call('EXPIRE', KEYS[1], tonumber(ARGV[2]) + 86400)
redis.call('EXPIRE', KEYS[2], tonumber(ARGV[2]) + 86400)
return {1, used, pending + 1, resetAt}
`;

const COMMIT_SCRIPT = `
if redis.call('ZREM', KEYS[2], ARGV[1]) == 0 then return 0 end
redis.call('HINCRBY', KEYS[1], 'used', 1)
return 1
`;

const RELEASE_SCRIPT = `return redis.call('ZREM', KEYS[1], ARGV[1])`;

const READ_SCRIPT = `
local now = tonumber(ARGV[1])
local resetAt = tonumber(redis.call('HGET', KEYS[1], 'resetAt') or '0')
if resetAt <= now then
  resetAt = now + tonumber(ARGV[2])
  return {0, 0, resetAt}
end
redis.call('ZREMRANGEBYSCORE', KEYS[2], '-inf', now)
return {tonumber(redis.call('HGET', KEYS[1], 'used') or '0'), tonumber(redis.call('ZCARD', KEYS[2])), resetAt}
`;

const toQuota = (
  result: Array<number | string>,
  limit: number,
): GenerationQuota => {
  const used = Number(result[0]);
  const pending = Number(result[1]);
  const resetAt = Number(result[2]);
  return {
    used,
    pending,
    limit,
    remaining: Math.max(0, limit - used - pending),
    resetAt: new Date(resetAt * 1000).toISOString(),
  };
};

export async function getGenerationQuota(
  userId: string,
  entitlements: Entitlements,
  now = new Date(),
): Promise<GenerationQuota> {
  const result = await upstashRedis.eval<unknown[], Array<number | string>>(
    READ_SCRIPT,
    [quotaKey(userId), pendingKey(userId)],
    [Math.floor(now.getTime() / 1000), WINDOW_SECONDS],
  );
  return toQuota(result, entitlements.aiGenerationsPerWindow);
}

export async function reserveGeneration(
  userId: string,
  entitlements: Entitlements,
  now = new Date(),
): Promise<{ token: string; quota: GenerationQuota } | null> {
  const token = randomUUID();
  const result = await upstashRedis.eval<unknown[], Array<number | string>>(
    RESERVE_SCRIPT,
    [quotaKey(userId), pendingKey(userId)],
    [
      Math.floor(now.getTime() / 1000),
      WINDOW_SECONDS,
      entitlements.aiGenerationsPerWindow,
      RESERVATION_SECONDS,
      token,
    ],
  );

  if (Number(result[0]) !== 1) return null;
  return {
    token,
    quota: toQuota([result[1], result[2], result[3]], entitlements.aiGenerationsPerWindow),
  };
}

export async function commitGeneration(
  userId: string,
  token: string,
): Promise<boolean> {
  const result = await upstashRedis.eval<unknown[], number>(
    COMMIT_SCRIPT,
    [quotaKey(userId), pendingKey(userId)],
    [token],
  );
  return result === 1;
}

export async function releaseGeneration(
  userId: string,
  token: string,
): Promise<void> {
  await upstashRedis.eval(RELEASE_SCRIPT, [pendingKey(userId)], [token]);
}
