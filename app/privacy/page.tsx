import { Footer } from '@/components/Footer';
import { TopMenu } from '@/components/TopMenu';

export const metadata = { title: 'Privacy | Aimorpher' };

export default function PrivacyPage() {
  return <div className="min-h-screen bg-[#f7f8fb]"><TopMenu /><main className="prose mx-auto max-w-3xl px-6 py-14"><h1>Privacy Policy</h1><p>Last updated: August 23, 2026</p><h2>Data we process</h2><p>We process account identifiers, uploaded resume files, structured Profile content, publication settings, generation counts, subscription state, and aggregate product events needed to operate Aimorpher.</p><h2>AI processing</h2><p>Resume content is sent to Together AI for generation and may pass through Helicone for model observability. A job description is sent for a job-specific generation but is not stored by Aimorpher after that request. Review those providers&apos; policies before submitting sensitive information.</p><h2>Storage and payments</h2><p>Uploaded files are stored in Cloudflare R2 and application records in Upstash Redis. Creem processes checkout, payment method, tax, subscription, portal, and refund data; Aimorpher does not store full card details.</p><h2>Measurement</h2><p>Product analytics contain only enumerated event names and counts. We do not send resume text, job descriptions, contact details, or usernames as analytics properties.</p><h2>Deletion</h2><p>You may delete your resume and Profile data from the product. Following a Pro downgrade, non-primary versions are private for 30 days before automatic deletion unless you resubscribe.</p></main><Footer /></div>;
}
