import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { resolveEntitlements } from '@/lib/billing/entitlements';
import { getBillingAccount } from '@/lib/billing/repository';
import { getGenerationQuota } from '@/lib/billing/quota';
import { listJobProfiles } from '@/lib/server/profileRepository';
import { getResume } from '@/lib/server/redisActions';
import { enforceExpiredGracePeriod } from '@/lib/billing/lifecycle';

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const resume = await getResume(user.id);
  const account = await getBillingAccount(user.id, resume?.plan);
  await enforceExpiredGracePeriod(account);
  const entitlements = resolveEntitlements(account);
  const [quota, profiles] = await Promise.all([
    getGenerationQuota(user.id, entitlements),
    listJobProfiles(user.id),
  ]);
  return NextResponse.json({
    account,
    entitlements,
    quota,
    profileCount: (resume ? 1 : 0) + profiles.length,
  });
}
