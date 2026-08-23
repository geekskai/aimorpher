import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { cancelCreemSubscription, getCreemProductId, upgradeCreemSubscription } from '@/lib/billing/creem';
import { getBillingAccount, saveBillingAccount } from '@/lib/billing/repository';
import { getResume } from '@/lib/server/redisActions';

const RequestSchema = z.object({ cadence: z.enum(['monthly', 'annual']) });

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const parsed = RequestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid billing cadence' }, { status: 400 });
  const resume = await getResume(user.id);
  const account = await getBillingAccount(user.id, resume?.plan);
  if (account.source !== 'creem' || !account.creemSubscriptionId || !account.cadence) {
    return NextResponse.json({ error: 'No Creem subscription to change' }, { status: 409 });
  }
  if (account.cadence === parsed.data.cadence) return NextResponse.json({ account });

  try {
    if (account.cadence === 'monthly' && parsed.data.cadence === 'annual') {
      await upgradeCreemSubscription(account.creemSubscriptionId, getCreemProductId('annual'));
      return NextResponse.json({ pending: true, message: 'The prorated upgrade is being confirmed by webhook.' });
    }
    await cancelCreemSubscription(account.creemSubscriptionId);
    await saveBillingAccount({ ...account, pendingCadence: 'monthly', status: 'scheduled_cancel' });
    return NextResponse.json({ pending: true, message: 'Annual remains active until period end; monthly checkout will be available then.' });
  } catch (error) {
    console.error('Unable to change billing cadence:', error);
    return NextResponse.json({ error: 'Unable to change billing cadence' }, { status: 503 });
  }
}
