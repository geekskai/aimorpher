import type { Metadata } from 'next';
import { CreditCard, LockKeyhole, Mail, Wrench } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { TopMenu } from '@/components/TopMenu';
import { buildContactPageJsonLd, serializeJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Aimorpher for product support, billing questions, refunds, privacy requests, or help managing a published professional profile.',
  alternates: { canonical: '/contact' },
};

const supportTopics = [
  {
    icon: Wrench,
    title: 'Product support',
    description: 'Include what you were trying to do and the page where the problem occurred.',
  },
  {
    icon: CreditCard,
    title: 'Billing and refunds',
    description: 'Include your account email and Creem order reference, but never card details.',
  },
  {
    icon: LockKeyhole,
    title: 'Privacy requests',
    description: 'Use the email associated with your account so the request can be verified safely.',
  },
] as const;

export default function ContactPage() {
  const jsonLd = buildContactPageJsonLd();

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-[#0a0d12]">
      <TopMenu />
      <main className="flex-1">
        <section className="border-y border-[#dfe3ea] bg-white">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8">
            <Mail className="mx-auto size-7 text-[#315efb]" aria-hidden="true" />
            <h1 className="mt-5 font-sans text-5xl font-black tracking-[-0.045em] sm:text-6xl">
              Contact Aimorpher
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#596170]">
              For product, billing, refund, or privacy support, email{' '}
              <a
                href="mailto:support@aimorpher.com"
                className="font-semibold text-[#0a0d12] underline underline-offset-4"
              >
                support@aimorpher.com
              </a>
              .
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {supportTopics.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-xl border border-[#dfe3ea] bg-white p-6">
                <Icon className="size-5 text-[#315efb]" aria-hidden="true" />
                <h2 className="mt-5 font-sans text-lg font-bold">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#596170]">{description}</p>
              </article>
            ))}
          </div>
          <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-[#d7dce5] bg-[#eef1f6] p-6 text-sm leading-6 text-[#4d5666]">
            Do not email passwords, payment-card details, or a resume containing
            information that is not needed for the support request.
          </div>
        </section>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <Footer />
    </div>
  );
}
