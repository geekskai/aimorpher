import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ResumeDataSchema } from '@/lib/resume';
import { deleteJobProfile, getJobProfile, updateJobProfile } from '@/lib/server/profileRepository';
import { getBillingAccount } from '@/lib/billing/repository';
import { resolvePlan } from '@/lib/billing/entitlements';
import { enforceExpiredGracePeriod } from '@/lib/billing/lifecycle';

const UpdateSchema = z.object({
  label: z.string().trim().min(1).max(80).optional(),
  status: z.enum(['live', 'draft']).optional(),
  resumeData: ResumeDataSchema.optional(),
}).refine((value) => Object.keys(value).length > 0);

type Context = { params: Promise<{ slug: string }> };

export async function GET(_: Request, { params }: Context) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const account = await getBillingAccount(user.id);
  if (resolvePlan(account) !== 'pro') {
    await enforceExpiredGracePeriod(account);
    return NextResponse.json({ error: 'Pro plan required' }, { status: 403 });
  }
  const profile = await getJobProfile(user.id, (await params).slug);
  return profile ? NextResponse.json({ profile }) : NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function PATCH(request: Request, { params }: Context) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const account = await getBillingAccount(user.id);
  if (resolvePlan(account) !== 'pro') {
    await enforceExpiredGracePeriod(account);
    return NextResponse.json({ error: 'Pro plan required' }, { status: 403 });
  }
  const parsed = UpdateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid update', details: parsed.error.issues }, { status: 400 });
  try {
    return NextResponse.json({ profile: await updateJobProfile(user.id, (await params).slug, parsed.data) });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    return NextResponse.json({ error: message === 'PROFILE_LOCKED' ? 'Profile is locked until you resubscribe' : 'Profile not found' }, { status: message === 'PROFILE_LOCKED' ? 423 : 404 });
  }
}

export async function DELETE(_: Request, { params }: Context) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await deleteJobProfile(user.id, (await params).slug);
  return NextResponse.json({ success: true });
}
