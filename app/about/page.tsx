import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Code2, Eye, ShieldCheck } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { TopMenu } from '@/components/TopMenu';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn how Aimorpher helps technical job seekers turn a PDF resume into an editable professional website with review, privacy, and publishing controls.',
  alternates: { canonical: '/about' },
};

const principles = [
  {
    icon: Eye,
    title: 'Review before publishing',
    description:
      'AI creates a structured draft, but you decide what is accurate and what becomes public.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy is a product control',
    description:
      'Choose whether email, phone, location, education, and resume downloads appear on your profile.',
  },
  {
    icon: Code2,
    title: 'Open implementation',
    description:
      'Aimorpher is open source, so its product direction and implementation can be inspected on GitHub.',
  },
] as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fb] text-[#0a0d12]">
      <TopMenu />
      <main>
        <section className="border-y border-[#dfe3ea] bg-white">
          <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#315efb]">
              About Aimorpher
            </p>
            <h1 className="mt-4 max-w-3xl font-sans text-5xl font-black tracking-[-0.045em] sm:text-6xl">
              Your experience deserves more than an attachment.
            </h1>
            <p className="mt-7 max-w-2xl font-sans text-lg leading-8 text-[#596170]">
              Aimorpher is a resume website builder for developers and other
              technical job seekers. It turns a PDF resume into an editable
              profile that can be reviewed, published, and shared as one link.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {principles.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-xl border border-[#dfe3ea] bg-white p-6">
                <Icon className="size-5 text-[#315efb]" aria-hidden="true" />
                <h2 className="mt-5 font-sans text-xl font-bold">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#596170]">{description}</p>
              </article>
            ))}
          </div>

          <div className="mt-16 grid gap-8 rounded-2xl border border-[#0a0d12] bg-[#0a0d12] px-7 py-10 text-white md:grid-cols-[1fr_auto] md:items-center md:px-10">
            <div>
              <h2 className="font-sans text-3xl font-black tracking-tight">Built in the open</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                Review the source, report a technical issue, or follow the product as it evolves.
              </p>
            </div>
            <a
              href="https://github.com/geekskai/aimorpher"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-md bg-white px-5 font-semibold text-[#0a0d12]"
            >
              View on GitHub
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </a>
          </div>

          <p className="mt-10 text-center text-sm text-[#596170]">
            Need product, billing, or privacy help?{' '}
            <Link href="/contact" className="font-semibold text-[#0a0d12] underline underline-offset-4">
              Contact Aimorpher
            </Link>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
