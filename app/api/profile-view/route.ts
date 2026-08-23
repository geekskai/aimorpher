import {
  getResume,
  getUserIdByUsername,
  recordProfileView,
} from '@/lib/server/redisActions';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
  username: z.string().trim().min(1).max(40),
});

export async function POST(request: Request) {
  try {
    const { username } = RequestSchema.parse(await request.json());
    const userId = await getUserIdByUsername(username);
    if (!userId) return new NextResponse(null, { status: 204 });

    const resume = await getResume(userId);
    if (resume?.status === 'live') await recordProfileView(userId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Unable to record view' }, { status: 500 });
  }
}
