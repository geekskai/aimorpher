import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { CreateJobProfileSchema } from '@/lib/profiles';
import { resolveEntitlements } from '@/lib/billing/entitlements';
import { getBillingAccount } from '@/lib/billing/repository';
import { commitGeneration, releaseGeneration, reserveGeneration } from '@/lib/billing/quota';
import { generateJobProfile } from '@/lib/server/ai/generateJobProfile';
import { createJobProfile, getJobProfile, listJobProfiles } from '@/lib/server/profileRepository';
import { getResume } from '@/lib/server/redisActions';

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ profiles: await listJobProfiles(user.id) });
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const parsed = CreateJobProfileSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid profile request', details: parsed.error.issues }, { status: 400 });

  const resume = await getResume(user.id);
  if (!resume?.resumeData) return NextResponse.json({ error: 'Create a primary profile first' }, { status: 409 });
  const entitlements = resolveEntitlements(await getBillingAccount(user.id, resume.plan));
  if (entitlements.plan !== 'pro') return NextResponse.json({ error: 'Pro plan required', code: 'PROFILE_LIMIT_REACHED' }, { status: 403 });
  const [profiles, existingSlug] = await Promise.all([
    listJobProfiles(user.id),
    getJobProfile(user.id, parsed.data.slug),
  ]);
  if (existingSlug) return NextResponse.json({ error: 'Profile URL already exists', code: 'PROFILE_SLUG_TAKEN' }, { status: 409 });
  if (profiles.length + 1 >= entitlements.maxProfiles) return NextResponse.json({ error: 'Profile limit reached', code: 'PROFILE_LIMIT_REACHED' }, { status: 409 });
  const reservation = await reserveGeneration(user.id, entitlements);
  if (!reservation) return NextResponse.json({ error: 'AI generation limit reached', code: 'AI_QUOTA_REACHED' }, { status: 429 });

  try {
    const generated = await generateJobProfile(resume.resumeData, parsed.data.jobDescription);
    if (!generated) throw new Error('GENERATION_FAILED');
    const profile = await createJobProfile({
      userId: user.id,
      label: parsed.data.label,
      slug: parsed.data.slug,
      resumeData: generated,
      maxProfiles: entitlements.maxProfiles,
    });
    await commitGeneration(user.id, reservation.token);
    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    await releaseGeneration(user.id, reservation.token);
    const message = error instanceof Error ? error.message : '';
    if (message === 'PROFILE_LIMIT_REACHED') return NextResponse.json({ error: 'Profile limit reached', code: message }, { status: 409 });
    if (message === 'PROFILE_SLUG_TAKEN') return NextResponse.json({ error: 'Profile URL already exists', code: message }, { status: 409 });
    console.error('Unable to create job profile:', error);
    return NextResponse.json({ error: 'Profile generation failed; no quota was charged' }, { status: 502 });
  }
}
