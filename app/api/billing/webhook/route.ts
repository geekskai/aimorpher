import { NextResponse } from 'next/server';
import { processCreemEvent, verifyCreemSignature } from '@/lib/billing/webhook';

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!verifyCreemSignature(rawBody, request.headers.get('creem-signature'))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
  try {
    const result = await processCreemEvent(JSON.parse(rawBody));
    return NextResponse.json({ received: true, result });
  } catch (error) {
    console.error('Creem webhook failed:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}
