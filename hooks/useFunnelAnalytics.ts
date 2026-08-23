'use client';

import { usePlausible } from 'next-plausible';

type FunnelEvents = {
  upload_started: { source: 'resume' | 'linkedin_pdf' };
  upload_succeeded: { source: 'resume' | 'linkedin_pdf' };
  processing_started: never;
  ai_generation_succeeded: never;
  profile_edit_saved: { section: 'resume' | 'profile' };
  profile_published: { first_publish: boolean };
  profile_shared: { method: 'copy_link' };
  upgrade_viewed: { source: 'home' | 'editor' | 'pricing' };
  checkout_started: { billing_period: 'monthly' | 'annual' };
  payment_succeeded: { billing_period: 'monthly' | 'annual' };
  trial_started: { billing_period: 'monthly' };
  trial_converted: { billing_period: 'monthly' };
  trial_canceled: { billing_period: 'monthly' };
  quota_reached: { quota: 'ai_generation' | 'profile' };
  version_created: { profile_count: number };
  payment_failed: { billing_period: 'monthly' | 'annual' };
  account_downgraded: { previous_plan: 'pro' };
};

export function useFunnelAnalytics() {
  return usePlausible<FunnelEvents>();
}
