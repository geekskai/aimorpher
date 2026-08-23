import { getProfileViews, getResume } from '@/lib/server/redisActions';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resume = await getResume(user.id);
  if (resume?.plan !== 'pro') {
    return NextResponse.json({ error: 'Pro plan required' }, { status: 403 });
  }

  return NextResponse.json({ views: await getProfileViews(user.id) });
}
