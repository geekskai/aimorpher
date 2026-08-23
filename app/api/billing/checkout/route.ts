import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createCreemCheckout } from '@/lib/billing/creem';
import { getBillingAccount } from '@/lib/billing/repository';
import { getResume } from '@/lib/server/redisActions';

const RequestSchema = z.object({ cadence: z.enum(['monthly', 'annual']) });

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (process.env.CREEM_SELF_SERVE_ENABLED !== 'true') {
    return NextResponse.json({ error: 'Self-serve billing is not open yet' }, { status: 503 });
  }
  try {
    const { cadence } = RequestSchema.parse(await request.json());
    const resume = await getResume(user.id);
    const account = await getBillingAccount(user.id, resume?.plan);
    if (account.source === 'manual' || ['trialing', 'active', 'scheduled_cancel', 'past_due'].includes(account.status)) {
      return NextResponse.json({ error: 'Manage the current plan in billing settings' }, { status: 409 });
    }
    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) return NextResponse.json({ error: 'A verified email is required' }, { status: 400 });
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
    const checkout = await createCreemCheckout({
      cadence,
      userId: user.id,
      email,
      customerId: account.creemCustomerId,
      successUrl: `${origin}/pricing?checkout=success`,
      trialEligible: cadence === 'monthly' && !account.trialUsedAt,
    });
    return NextResponse.json({ url: checkout.checkout_url });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid billing cadence' }, { status: 400 });
    console.error('Unable to create checkout:', error);
    return NextResponse.json({ error: 'Checkout is temporarily unavailable' }, { status: 503 });
  }
}
