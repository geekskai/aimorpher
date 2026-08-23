import Link from 'next/link';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import { FullResume } from '@/components/resume/FullResume';
import { getJobProfile } from '@/lib/server/profileRepository';

export default async function JobProfilePreview({ params }: { params: Promise<{ slug: string }> }) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
  const profile = await getJobProfile(userId, (await params).slug);
  if (!profile) notFound();
  const user = await (await clerkClient()).users.getUser(userId);

  return <main className="min-h-screen bg-neutral-50 py-8">
    <div className="mx-auto mb-4 flex max-w-3xl items-center justify-between px-4">
      <div><p className="font-semibold">{profile.label}</p><p className="text-sm text-neutral-600">Review this generated draft before publishing it from the profile manager.</p></div>
      <Link className="rounded-md border bg-white px-3 py-2 text-sm font-medium" href="/preview">Back to editor</Link>
    </div>
    {profile.lockedAt && <p className="mx-auto mb-4 max-w-3xl rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">This version is private and read-only until {profile.expiresAt ? new Date(profile.expiresAt).toLocaleDateString() : 'it expires'}.</p>}
    <div className="mx-auto max-w-3xl border bg-white"><FullResume resume={profile.resumeData} profilePicture={user.imageUrl} /></div>
  </main>;
}
