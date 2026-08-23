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
  paid_pilot_clicked: { billing_period: 'monthly' | 'annual' };
  checkout_started: { billing_period: 'monthly' | 'annual' };
  payment_succeeded: { billing_period: 'monthly' | 'annual' };
};

export function useFunnelAnalytics() {
  return usePlausible<FunnelEvents>();
}
