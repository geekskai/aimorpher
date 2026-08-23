import { Footer } from '@/components/Footer';
import { TopMenu } from '@/components/TopMenu';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Review Aimorpher refund eligibility for annual and monthly Pro subscriptions, trial cancellation, service failures, and mandatory consumer rights.',
  alternates: { canonical: '/refund-policy' },
};

export default function RefundPolicyPage() {
  return <div className="min-h-screen bg-[#f7f8fb]"><TopMenu /><main className="prose mx-auto max-w-3xl px-6 py-14"><h1>Refund Policy</h1><p>Last updated: August 23, 2026</p><h2>Annual Pro</h2><p>You may request a full refund of the first Annual Pro payment within 14 days of that payment. This offer does not renew for later annual payments.</p><h2>Monthly Pro</h2><p>Monthly Pro includes a one-time 7-day trial for eligible Billing Accounts. Cancel before the displayed trial end date to avoid the first charge. We do not otherwise offer a general voluntary refund window for monthly payments.</p><h2>Exceptions</h2><p>Nothing in this policy limits mandatory consumer rights. We may also issue remedies for verified service failures. Refunds and subscription cancellation are separate: use the Creem Customer Portal to stop renewal.</p><h2>Requesting a refund</h2><p>Email <a href="mailto:support@aimorpher.com">support@aimorpher.com</a> and include the account email and Creem order reference. Do not send card details.</p></main><Footer /></div>;
}
