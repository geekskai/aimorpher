import type { AccountPlan } from '@/lib/server/redisActions';
import type { ResumeDataSchemaType } from '@/lib/resume';

export const PLAN_DETAILS = {
  free: {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      'One public professional profile',
      '3 successful AI generations every 30 days',
      'Projects and professional links',
      'Signal theme with Aimorpher branding',
    ],
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 12,
    annualPrice: 96,
    features: [
      'Up to 5 profiles for different opportunities',
      '30 successful AI generations every 30 days',
      'All three professional themes',
      'Remove Aimorpher branding',
      'Private profile-view analytics',
      'Job-specific versions at your profile URL',
    ],
  },
} as const satisfies Record<AccountPlan, object>;

export const canUseTheme = (plan: AccountPlan, themeId: string) =>
  plan === 'pro' || themeId === 'signal';

export const enforcePlanAccess = (
  resumeData: ResumeDataSchemaType,
  plan: AccountPlan,
): ResumeDataSchemaType => ({
  ...resumeData,
  themeId: canUseTheme(plan, resumeData.themeId)
    ? resumeData.themeId
    : 'signal',
});
