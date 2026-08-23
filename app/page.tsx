import { Footer } from '@/components/Footer';
import { TopMenu } from '@/components/TopMenu';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Check,
  Code2,
  EyeOff,
  FileText,
  Github,
  Globe2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { buildHomeJsonLd, serializeJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Resume Website Builder for Developers',
  description:
    'Turn a PDF resume into an editable professional website for technical hiring. Review every detail, publish free, and share one polished profile link.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Aimorpher',
    url: '/',
    title: 'Resume Website Builder for Developers | Aimorpher',
    description:
      'Turn a PDF resume into an editable professional website for technical hiring.',
    images: '/opengraph-image',
  },
};

const buildSteps = [
  {
    title: 'Import your source',
    description: 'Upload a resume or the PDF export from your LinkedIn profile.',
    icon: FileText,
  },
  {
    title: 'Review the draft',
    description: 'AI structures your experience. You decide what is public.',
    icon: Sparkles,
  },
  {
    title: 'Publish one link',
    description: 'Share a fast, searchable profile built for technical hiring.',
    icon: Globe2,
  },
] as const;

const buildLog = [
  ['resume.pdf', 'parsed'],
  ['work history', 'structured'],
  ['project links', 'detected'],
  ['contact privacy', 'reviewed'],
] as const;

const frequentlyAskedQuestions = [
  {
    question: 'What file does Aimorpher accept?',
    answer:
      'Aimorpher accepts a PDF resume, including a PDF export of a LinkedIn profile. The file is parsed into a structured draft that you review before publishing.',
  },
  {
    question: 'Can I edit the generated website?',
    answer:
      'Yes. You can review and edit the generated profile before it goes live. You remain responsible for checking dates, claims, links, and other details for accuracy.',
  },
  {
    question: 'Does uploading a resume make it public?',
    answer:
      'No. Your first result is a private draft. A profile is public only after you choose to publish it, and you can control whether contact and education details are visible.',
  },
  {
    question: 'What is included in the free plan?',
    answer:
      'The free plan lets you publish one professional profile. Pro adds job-specific profile versions, more successful AI generations, additional themes, private view analytics, and removes Aimorpher branding.',
  },
  {
    question: 'Can I delete my resume and profile data?',
    answer:
      'Yes. You can delete the uploaded PDF and generated profile from the product. The Privacy Policy explains how resume, AI, analytics, and subscription data are processed.',
  },
] as const;

export default function Home() {
  const jsonLd = buildHomeJsonLd();

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-[#0a0d12]">
      <TopMenu />
      <main>
        <section className="relative overflow-hidden border-y border-[#dfe3ea]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#dfe3ea_1px,transparent_1px),linear-gradient(to_bottom,#dfe3ea_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
          <div className="relative mx-auto grid min-h-[680px] max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
            <div className="max-w-2xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#cfd5df] bg-white px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#4d5666]">
                <Code2 className="size-3.5" aria-hidden="true" />
                Built for technical job seekers
              </div>
              <h1 className="max-w-3xl font-sans text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                Turn your resume into
                <span className="mt-2 block text-[#315efb]">
                  a professional website.
                </span>
              </h1>
              <p className="mt-7 max-w-xl font-sans text-lg leading-8 text-[#596170]">
                Upload a PDF resume, review the structured draft, and publish a
                professional profile with the experience, projects, and links
                you want recruiters to see.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-12 rounded-md bg-[#0a0d12] px-6 text-base hover:bg-[#232832]"
                >
                  <Link href="/upload">
                    Build my professional site
                    <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-md border-[#cfd5df] bg-white px-6 text-base"
                >
                  <Link href="/sample">View a real profile sample</Link>
                </Button>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#596170]">
                {['Free profile', 'Edit before publishing', 'Delete your data'].map(
                  (benefit) => (
                    <span key={benefit} className="inline-flex items-center gap-2">
                      <Check className="size-4 text-[#147a42]" aria-hidden="true" />
                      {benefit}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-5 rotate-2 rounded-3xl border border-[#aeb9ff] bg-[#dfe4ff]" />
              <div className="relative overflow-hidden rounded-2xl border border-[#0a0d12] bg-[#0a0d12] shadow-[0_30px_90px_rgba(30,45,90,0.24)]">
                <div className="flex items-center justify-between border-b border-white/15 px-5 py-3 font-mono text-xs text-white/60">
                  <span>profile.build</span>
                  <span className="inline-flex items-center gap-2 text-[#bdf7d0]">
                    <span className="size-2 rounded-full bg-[#42d680]" /> ready
                  </span>
                </div>
                <div className="space-y-5 p-6 sm:p-8">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#8fa6ff]">
                      Build output
                    </p>
                    <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-white">
                      Alex Chen
                    </h2>
                    <p className="mt-1 text-sm text-white/60">
                      Full-stack engineer · AI products · Toronto
                    </p>
                  </div>
                  <div className="space-y-2 font-mono text-sm">
                    {buildLog.map(([label, status]) => (
                      <div
                        key={label}
                        className="grid grid-cols-[1fr_auto] gap-4 border-b border-white/10 py-2.5"
                      >
                        <span className="text-white/70">{label}</span>
                        <span className="text-[#bdf7d0]">✓ {status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-white/15 bg-white/[0.04] p-4">
                      <Github className="size-5 text-white" aria-hidden="true" />
                      <p className="mt-3 text-xs text-white/50">Featured project</p>
                      <p className="mt-1 text-sm font-semibold text-white">Vector search toolkit</p>
                    </div>
                    <div className="rounded-lg border border-white/15 bg-white/[0.04] p-4">
                      <ShieldCheck className="size-5 text-white" aria-hidden="true" />
                      <p className="mt-3 text-xs text-white/50">Visibility</p>
                      <p className="mt-1 text-sm font-semibold text-white">Reviewed by you</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#dfe3ea] bg-white">
          <div className="mx-auto grid max-w-6xl gap-px bg-[#dfe3ea] md:grid-cols-3">
            {[
              [ShieldCheck, 'Private draft first', 'Nothing is public until you publish it.'],
              [EyeOff, 'Choose what recruiters see', 'Hide your phone, email, location, or education.'],
              [Code2, 'Search-friendly by design', 'Each profile includes structured professional metadata.'],
            ].map(([Icon, title, description]) => (
              <div key={title as string} className="bg-white px-7 py-8">
                <Icon className="size-5 text-[#315efb]" aria-hidden="true" />
                <h2 className="mt-4 font-sans text-lg font-bold">{title as string}</h2>
                <p className="mt-2 text-sm leading-6 text-[#596170]">{description as string}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#315efb]">
              Three deliberate steps
            </p>
            <h2 className="mt-4 font-sans text-4xl font-black tracking-[-0.035em] sm:text-5xl">
              Fast to generate. Yours to approve.
            </h2>
          </div>
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {buildSteps.map(({ title, description, icon: Icon }, index) => (
              <li key={title} className="rounded-xl border border-[#dfe3ea] bg-white p-6">
                <div className="flex items-center justify-between">
                  <Icon className="size-5 text-[#315efb]" aria-hidden="true" />
                  <span className="font-mono text-xs text-[#8b93a1]">0{index + 1}</span>
                </div>
                <h3 className="mt-10 font-sans text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#596170]">{description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-y border-[#dfe3ea] bg-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#315efb]">
                Built for a technical job search
              </p>
              <h2 className="mt-4 font-sans text-4xl font-black tracking-[-0.035em]">
                A resume website that stays grounded in your experience.
              </h2>
              <p className="mt-5 text-base leading-7 text-[#596170]">
                Aimorpher is designed for developers, engineers, product
                builders, and other technical candidates who need more room
                than a PDF gives them. It organizes the work history,
                education, skills, projects, and links already present in your
                resume into a profile that is easier to scan and share.
              </p>
              <p className="mt-4 text-base leading-7 text-[#596170]">
                A GitHub or portfolio link can be displayed when it appears in
                your source material or you add it during editing. Aimorpher
                does not claim to import or analyze an entire GitHub account.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Edit the draft', 'Review summaries, dates, links, projects, and skills before publishing.'],
                ['Control visibility', 'Choose whether email, phone, location, education, and downloads appear.'],
                ['Publish free', 'Create one public professional profile with a stable link on the Free plan.'],
                ['Tailor with Pro', 'Create job-specific versions without replacing your primary public profile.'],
              ].map(([title, description]) => (
                <article key={title} className="rounded-xl border border-[#dfe3ea] bg-[#f7f8fb] p-5">
                  <h3 className="font-sans text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#596170]">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#dfe3ea] bg-[#eef1f6]">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#315efb]">
                Aimorpher Pro
              </p>
              <h2 className="mt-3 max-w-2xl font-sans text-4xl font-black tracking-[-0.035em]">
                Start free. Upgrade when your profile becomes part of your job search.
              </h2>
              <p className="mt-4 max-w-xl text-[#596170]">
                Pro adds up to five profiles, 30 successful AI generations,
                professional themes, private view analytics, and no branding.
              </p>
            </div>
            <div className="min-w-64 rounded-xl border border-[#0a0d12] bg-white p-6 shadow-[8px_8px_0_#0a0d12]">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#596170]">Pro</p>
              <p className="mt-3 font-sans text-4xl font-black">
                $12<span className="text-base font-medium text-[#596170]">/month</span>
              </p>
              <Button asChild className="mt-6 w-full bg-[#315efb] hover:bg-[#244bd1]">
                <Link href="/pricing">Compare plans</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
          <div className="text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#315efb]">
              Questions before you publish
            </p>
            <h2 className="mt-4 font-sans text-4xl font-black tracking-[-0.035em] sm:text-5xl">
              Resume website builder FAQ
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#596170]">
              Understand the input, editing process, privacy controls, and plan
              limits before creating your profile.
            </p>
          </div>
          <div className="mt-10 divide-y divide-[#dfe3ea] border-y border-[#dfe3ea]">
            {frequentlyAskedQuestions.map(({ question, answer }) => (
              <details key={question} className="group py-5">
                <summary className="cursor-pointer list-none pr-6 font-sans text-lg font-bold marker:content-none">
                  {question}
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#596170]">{answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-[#596170]">
            See the{' '}
            <Link href="/sample" className="font-semibold text-[#0a0d12] underline underline-offset-4">
              professional profile sample
            </Link>
            , compare{' '}
            <Link href="/pricing" className="font-semibold text-[#0a0d12] underline underline-offset-4">
              Free and Pro
            </Link>
            , or review the{' '}
            <Link href="/privacy" className="font-semibold text-[#0a0d12] underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
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
