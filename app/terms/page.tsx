import { Footer } from '@/components/Footer';
import { TopMenu } from '@/components/TopMenu';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the Aimorpher terms for subscriptions, trials, cancellation, generated content, profile access, and the service providers used to operate the product.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return <div className="min-h-screen bg-[#f7f8fb]"><TopMenu /><main className="prose mx-auto max-w-3xl px-6 py-14"><h1>Terms of Service</h1><p>Last updated: August 23, 2026</p><h2>Subscriptions</h2><p>Pro Monthly is USD $12 per month and Pro Annual is USD $96 per year. Displayed prices include applicable tax. Subscriptions renew automatically until canceled through the Creem Customer Portal.</p><h2>Monthly trial</h2><p>An eligible Billing Account may use one 7-day Monthly trial. A payment method is required. Unless canceled before the stated trial end date, Creem automatically charges $12 and starts the monthly subscription. Annual subscriptions do not include a trial.</p><h2>Cancellation and access</h2><p>Cancel in the Customer Portal. Monthly trial cancellation takes effect when the trial ends and does not result in a charge. Paid access normally continues to the end of the current period. When Pro ends, the Primary Profile remains available under Free limits; job-specific versions become private and read-only and are deleted after 30 days unless Pro is restored.</p><h2>Content accuracy</h2><p>You are responsible for reviewing generated content before publishing it. Job-specific generation is instructed to use only facts already present in your Profile, but you must verify the result.</p><h2>Service providers</h2><p>Aimorpher uses Clerk for authentication, Together AI and Helicone for AI processing and observability, Cloudflare R2 for uploaded files, Upstash Redis for application data, Creem for billing, and Plausible for privacy-conscious product measurement.</p></main><Footer /></div>;
}
