import Link from 'next/link';
import { FullResume } from '@/components/resume/FullResume';
import { ResumeDataSchema } from '@/lib/resume';
import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { TopMenu } from '@/components/TopMenu';
import { ArrowRight, Eye, FolderGit2, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Professional Profile Sample',
  description: 'Explore a complete fictional Aimorpher profile to see how work experience, education, skills, projects, and contact controls appear after publishing.',
  alternates: { canonical: '/sample' },
};

const sample = ResumeDataSchema.parse({
  themeId: 'studio',
  visibility: {
    email: true,
    phone: false,
    location: true,
    education: true,
    resumeDownload: false,
  },
  profileBlocks: {
    projects: [
      {
        id: 'vector-search-toolkit',
        name: 'Vector search toolkit',
        description:
          'Designed a TypeScript toolkit that reduced search indexing latency and gave product teams a reusable evaluation workflow.',
        url: 'https://example.com/vector-search',
        sourceUrl: 'https://github.com/alexchen/vector-search-toolkit',
        technologies: ['TypeScript', 'PostgreSQL', 'React'],
      },
    ],
    links: [
      {
        id: 'technical-writing',
        label: 'Technical writing',
        url: 'https://example.com/writing',
        kind: 'writing',
      },
    ],
    resumeDownloadUrl: null,
  },
  header: {
    name: 'Alex Chen',
    shortAbout: 'Full-stack engineer building reliable AI products',
    location: 'Toronto, Canada',
    contacts: {
      website: 'https://example.com',
      email: 'alex@example.com',
      phone: '+1 555 0100',
      github: 'alexchen',
      linkedin: 'alexchen',
    },
    skills: ['TypeScript', 'React', 'PostgreSQL', 'AI product engineering'],
  },
  summary: 'Product-minded engineer experienced in turning ambiguous customer problems into fast, dependable web software.',
  workExperience: [
    {
      company: 'Northstar Labs',
      location: 'Toronto, Canada',
      contract: 'Full-time',
      title: 'Senior Software Engineer',
      start: '2022-04-01',
      end: null,
      description: 'Led the delivery of customer-facing workflow tools and improved reliability across the application platform.',
    },
    {
      company: 'Relay Systems',
      location: 'Remote',
      contract: 'Full-time',
      title: 'Software Engineer',
      start: '2019-06-01',
      end: '2022-03-31',
      description: 'Built TypeScript services and React interfaces for operational teams.',
    },
  ],
  education: [{ school: 'University of Waterloo', degree: 'BASc, Systems Design Engineering', start: '2014', end: '2019' }],
});

const profileSignals = [
  {
    icon: Eye,
    title: 'Recruiter-friendly scan',
    description: 'The role, location, experience, proof, and skills follow a predictable reading order.',
  },
  {
    icon: FolderGit2,
    title: 'Projects with evidence',
    description: 'Selected work connects outcomes to live demos, source code, and the technologies used.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy by choice',
    description: 'Alex shares an email and location while keeping the phone number and resume download private.',
  },
] as const;

export default function SamplePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8fb] text-[#0a0d12]">
      <TopMenu />

      <main>
        <section className="relative overflow-hidden border-b border-[#dfe3ea]">
          <div
            className="absolute inset-0 opacity-70"
            aria-hidden="true"
            style={{
              backgroundImage:
                'linear-gradient(#dfe3ea 1px, transparent 1px), linear-gradient(90deg, #dfe3ea 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              maskImage: 'linear-gradient(to bottom, black, transparent 92%)',
            }}
          />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[1fr_360px] lg:items-end lg:px-8 lg:py-24">
            <div>
              <div className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#cbd2de] bg-white/90 px-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#4d5666] shadow-sm">
                <span className="size-2 rounded-full bg-[#22a559]" aria-hidden="true" />
                Published profile preview
              </div>
              <h1 className="mt-7 max-w-4xl font-sans text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                See the finished profile
                <span className="mt-2 block text-[#315efb]">before you build yours.</span>
              </h1>
              <p className="mt-7 max-w-2xl font-sans text-lg leading-8 text-[#596170]">
                This fictional developer profile uses the same public layout,
                Studio theme, project cards, links, and visibility controls
                available in Aimorpher.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/upload"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#0a0d12] px-5 py-3 font-mono text-sm font-semibold text-white transition-colors hover:bg-[#25282e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315efb] focus-visible:ring-offset-2"
                >
                  Build my professional site
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="#profile-preview"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-[#cbd2de] bg-white px-5 py-3 font-mono text-sm font-semibold transition-colors hover:border-[#8b93a1] hover:bg-[#f3f5f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0d12] focus-visible:ring-offset-2"
                >
                  Explore the sample
                </Link>
              </div>
            </div>

            <aside className="rounded-2xl border border-[#1e232b] bg-[#0b0d11] p-6 text-white shadow-[8px_8px_0_#315efb]">
              <div className="flex items-center justify-between border-b border-white/15 pb-4 font-mono text-xs uppercase tracking-[0.14em] text-white/60">
                <span>Profile output</span>
                <span className="inline-flex items-center gap-2 text-[#bdf7d0]">
                  <span className="size-2 rounded-full bg-[#4bd37b]" aria-hidden="true" />
                  Live
                </span>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wide text-white/50">Theme</dt>
                  <dd className="mt-1 font-sans text-lg font-bold">Studio</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wide text-white/50">Profile</dt>
                  <dd className="mt-1 font-sans text-lg font-bold">Public</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wide text-white/50">Projects</dt>
                  <dd className="mt-1 font-sans text-lg font-bold">Included</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wide text-white/50">Phone</dt>
                  <dd className="mt-1 font-sans text-lg font-bold">Hidden</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section
          id="profile-preview"
          className="scroll-mt-6 border-b border-[#dfe3ea] bg-[#eef1f6] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
          aria-labelledby="profile-preview-heading"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#315efb]">
                  The published result
                </p>
                <h2
                  id="profile-preview-heading"
                  className="mt-3 font-sans text-3xl font-black tracking-[-0.035em] sm:text-4xl"
                >
                  A complete profile, ready to share.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#596170] sm:text-right">
                All information below is fictional. The layout matches what a
                visitor sees after a profile is published.
              </p>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-[#bfc6d2] bg-white shadow-[0_24px_70px_rgba(50,62,86,0.16)]">
              <div className="flex min-h-14 items-center gap-3 border-b border-[#dfe3ea] bg-[#f8f9fb] px-4 sm:px-5">
                <div className="hidden items-center gap-2 sm:flex" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-[#ff6b67]" />
                  <span className="size-2.5 rounded-full bg-[#f5bd4f]" />
                  <span className="size-2.5 rounded-full bg-[#4ecb71]" />
                </div>
                <div className="min-w-0 flex-1 rounded-md border border-[#dfe3ea] bg-white px-3 py-2 text-center font-mono text-xs text-[#596170] sm:mx-8">
                  <span className="block truncate">aimorpher.com/alex-chen</span>
                </div>
                <div className="inline-flex shrink-0 items-center gap-2 font-mono text-[11px] font-semibold uppercase text-[#147a42]">
                  <span className="size-2 rounded-full bg-[#22a559]" aria-hidden="true" />
                  Published
                </div>
              </div>
              <div className="bg-[#f7f8fb] px-2 py-4 sm:px-5 sm:py-6 lg:px-7 lg:py-8">
                <FullResume resume={sample} />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24" aria-labelledby="sample-signals-heading">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#315efb]">
              Designed for technical hiring
            </p>
            <h2
              id="sample-signals-heading"
              className="mt-3 font-sans text-3xl font-black tracking-[-0.035em] sm:text-4xl"
            >
              The right signals, without the portfolio clutter.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {profileSignals.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-xl border border-[#d7dce5] bg-white p-6 shadow-sm">
                <div className="flex size-11 items-center justify-center rounded-lg border border-[#d8e1ff] bg-[#eef1ff] text-[#315efb]">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-sans text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#596170]">{description}</p>
              </article>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#0a0d12] bg-[#0a0d12] p-7 text-white sm:flex-row sm:items-center sm:p-9">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#bdf7d0]">
                Your resume, upgraded
              </p>
              <h2 className="mt-3 max-w-2xl font-sans text-3xl font-black tracking-[-0.035em]">
                Turn your experience into one polished link.
              </h2>
            </div>
            <Link
              href="/upload"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-[#315efb] px-5 py-3 font-mono text-sm font-semibold text-white transition-colors hover:bg-[#426bff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0d12]"
            >
              Build free profile
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
