import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createCreemPortal } from '@/lib/billing/creem';
import { getBillingAccount } from '@/lib/billing/repository';
import { getResume } from '@/lib/server/redisActions';

export async function POST() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const resume = await getResume(user.id);
  const account = await getBillingAccount(user.id, resume?.plan);
  if (!account.creemCustomerId) return NextResponse.json({ error: 'No customer portal is available' }, { status: 404 });
  try {
    const portal = await createCreemPortal(account.creemCustomerId);
    return NextResponse.json({ url: portal.customer_portal_link });
  } catch (error) {
    console.error('Unable to create billing portal:', error);
    return NextResponse.json({ error: 'Billing portal is temporarily unavailable' }, { status: 503 });
  }
}
