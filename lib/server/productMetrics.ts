import { upstashRedis } from '@/lib/server/redis';
import type { BillingCadence } from '@/lib/billing/types';

export type BillingMetric =
  | 'trial_start'
  | 'trial_convert'
  | 'trial_cancel'
  | 'payment_failure'
  | 'downgrade';

export async function recordBillingMetric(
  event: BillingMetric,
  cadence: BillingCadence,
): Promise<void> {
  // Deliberately contains only enums and a count; never user or profile data.
  await upstashRedis.incr(`metrics:billing:${event}:${cadence}`);
}
