import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { clerkClient } from '@clerk/nextjs/server';
import { FullResume } from '@/components/resume/FullResume';
import { ProfileViewTracker } from '@/components/ProfileViewTracker';
import { getJobProfile } from '@/lib/server/profileRepository';
import { getUserIdByUsername } from '@/lib/server/redisActions';
import { getBillingAccount } from '@/lib/billing/repository';
import { resolvePlan } from '@/lib/billing/entitlements';
import { enforceExpiredGracePeriod } from '@/lib/billing/lifecycle';

type Params = Promise<{ username: string; versionSlug: string }>;

async function getPublicProfile(username: string, versionSlug: string) {
  const userId = await getUserIdByUsername(username);
  if (!userId) return null;
  const account = await getBillingAccount(userId);
  if (resolvePlan(account) !== 'pro') {
    await enforceExpiredGracePeriod(account);
    return null;
  }
  const profile = await getJobProfile(userId, versionSlug);
  if (!profile || profile.status !== 'live' || profile.lockedAt) return null;
  return { userId, profile };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { username, versionSlug } = await params;
  const result = await getPublicProfile(username, versionSlug);
  if (!result) return { title: 'Profile Not Found | Aimorpher', robots: { index: false, follow: false } };
  return {
    title: `${result.profile.resumeData.header.name} — ${result.profile.label} | Aimorpher`,
    description: result.profile.resumeData.summary,
  };
}

export default async function JobProfilePage({ params }: { params: Params }) {
  const { username, versionSlug } = await params;
  const result = await getPublicProfile(username, versionSlug);
  if (!result) notFound();
  const user = await (await clerkClient()).users.getUser(result.userId);
  return (
    <>
      <ProfileViewTracker username={username} versionSlug={versionSlug} />
      <FullResume resume={result.profile.resumeData} profilePicture={user.imageUrl} />
    </>
  );
}
