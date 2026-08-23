import { z } from 'zod';

export const PlanIdSchema = z.enum(['free', 'pro']);
export const BillingSourceSchema = z.enum(['free', 'creem', 'manual']);
export const SubscriptionStatusSchema = z.enum([
  'none',
  'trialing',
  'active',
  'scheduled_cancel',
  'past_due',
  'canceled',
  'expired',
  'refunded',
]);
export const BillingCadenceSchema = z.enum(['monthly', 'annual']);

export const BillingAccountSchema = z.object({
  userId: z.string().min(1),
  source: BillingSourceSchema.default('free'),
  status: SubscriptionStatusSchema.default('none'),
  cadence: BillingCadenceSchema.nullable().default(null),
  creemCustomerId: z.string().nullable().default(null),
  creemSubscriptionId: z.string().nullable().default(null),
  creemProductId: z.string().nullable().default(null),
  currentPeriodStart: z.string().datetime().nullable().default(null),
  currentPeriodEnd: z.string().datetime().nullable().default(null),
  graceEndsAt: z.string().datetime().nullable().default(null),
  trialUsedAt: z.string().datetime().nullable().default(null),
  pendingCadence: BillingCadenceSchema.nullable().default(null),
  lastEventAt: z.number().int().nonnegative().default(0),
  lastEventId: z.string().nullable().default(null),
  manualReviewRequired: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PlanId = z.infer<typeof PlanIdSchema>;
export type BillingSource = z.infer<typeof BillingSourceSchema>;
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;
export type BillingCadence = z.infer<typeof BillingCadenceSchema>;
export type BillingAccount = z.infer<typeof BillingAccountSchema>;

export type Entitlements = {
  plan: PlanId;
  maxProfiles: 1 | 5;
  aiGenerationsPerWindow: 3 | 30;
  allowedThemes: readonly ['signal'] | readonly ['signal', 'studio', 'terminal'];
  removeBranding: boolean;
  profileAnalytics: boolean;
};
