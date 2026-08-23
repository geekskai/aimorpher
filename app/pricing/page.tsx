import { PaidPilotLink } from '@/components/PaidPilotLink';
import { PricingAnalytics } from '@/components/PricingAnalytics';
import { TopMenu } from '@/components/TopMenu';
import { Footer } from '@/components/Footer';
import { PLAN_DETAILS } from '@/lib/plans';
import { Check, Minus } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Pricing | Aimorpher',
  description: 'Build a professional profile for free or join the Aimorpher Pro paid pilot.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fb]">
      <PricingAnalytics />
      <TopMenu />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#315efb]">
            Simple paid pilot
          </p>
          <h1 className="mt-4 font-sans text-5xl font-black tracking-[-0.045em]">
            Publish free. Pay for career leverage.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#596170]">
            Pro is an early paid pilot. Billing is confirmed personally before
            access is activated—there is no automatic charge from this page.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-[#d7dce5] bg-white p-7">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#596170]">Free</p>
            <p className="mt-3 font-sans text-5xl font-black">$0</p>
            <p className="mt-3 text-sm text-[#596170]">Everything needed to publish one professional profile.</p>
            <Link
              href="/upload"
              className="mt-7 flex h-11 items-center justify-center rounded-md border border-[#cfd5df] bg-white font-semibold transition-colors hover:bg-[#f3f5f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0d12]"
            >
              Build free profile
            </Link>
            <ul className="mt-7 space-y-3 text-sm">
              {PLAN_DETAILS.free.features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-[#147a42]" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </article>

          <article className="relative rounded-2xl border border-[#0a0d12] bg-[#0a0d12] p-7 text-white shadow-[9px_9px_0_#315efb]">
            <span className="absolute right-6 top-6 rounded-full bg-[#bdf7d0] px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0a0d12]">
              Paid pilot
            </span>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/60">Pro</p>
            <p className="mt-3 font-sans text-5xl font-black">
              $12<span className="text-base font-medium text-white/60">/mo</span>
            </p>
            <p className="mt-2 text-sm text-white/60">or $96 billed annually</p>
            <PaidPilotLink
              billingPeriod="monthly"
              className="mt-7 flex h-11 items-center justify-center rounded-md bg-[#315efb] font-semibold transition-colors hover:bg-[#426bff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Join the paid pilot
            </PaidPilotLink>
            <PaidPilotLink
              billingPeriod="annual"
              className="mt-3 flex h-10 items-center justify-center rounded-md border border-white/25 text-sm font-semibold text-white/80 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Choose annual pilot · $96/year
            </PaidPilotLink>
            <ul className="mt-7 space-y-3 text-sm">
              {PLAN_DETAILS.pro.features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  {feature.includes('Custom domains') ? (
                    <Minus className="mt-0.5 size-4 shrink-0 text-white/50" aria-hidden="true" />
                  ) : (
                    <Check className="mt-0.5 size-4 shrink-0 text-[#bdf7d0]" aria-hidden="true" />
                  )}
                  <span>
                    {feature}
                    {feature.includes('Custom domains') ? ' — coming during pilot' : ''}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-6 text-[#596170]">
          Aimorpher never sends resume text, contact details, or profile content
          as analytics properties. You can delete your uploaded PDF and generated
          profile from the editor at any time.
        </p>
      </main>
      <Footer />
    </div>
  );
}
