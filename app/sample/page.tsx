import Link from 'next/link';
import { FullResume } from '@/components/resume/FullResume';
import { ResumeDataSchema } from '@/lib/resume';

export const metadata = {
  title: 'Profile Sample | Aimorpher',
  description: 'See a complete Aimorpher professional profile before creating an account.',
};

const sample = ResumeDataSchema.parse({
  header: {
    name: 'Alex Chen', shortAbout: 'Full-stack engineer building reliable AI products', location: 'Toronto, Canada',
    contacts: { website: 'https://example.com', github: 'alexchen', linkedin: 'alexchen' },
    skills: ['TypeScript', 'React', 'PostgreSQL', 'AI product engineering'],
  },
  summary: 'Product-minded engineer experienced in turning ambiguous customer problems into fast, dependable web software.',
  workExperience: [
    { company: 'Northstar Labs', location: 'Toronto, Canada', contract: 'Full-time', title: 'Senior Software Engineer', start: '2022-04-01', end: null, description: 'Led the delivery of customer-facing workflow tools and improved reliability across the application platform.' },
    { company: 'Relay Systems', location: 'Remote', contract: 'Full-time', title: 'Software Engineer', start: '2019-06-01', end: '2022-03-31', description: 'Built TypeScript services and React interfaces for operational teams.' },
  ],
  education: [{ school: 'University of Waterloo', degree: 'BASc, Systems Design Engineering', start: '2014', end: '2019' }],
});

export default function SamplePage() {
  return <main className="min-h-screen bg-neutral-50 py-8">
    <div className="mx-auto mb-4 flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4">
      <div><p className="font-semibold">Aimorpher profile sample</p><p className="text-sm text-neutral-600">Fictional information shown in the real public-profile layout.</p></div>
      <Link className="rounded-md bg-[#315efb] px-4 py-2 text-sm font-semibold text-white" href="/upload">Build my profile</Link>
    </div>
    <div className="mx-auto max-w-3xl border bg-white"><FullResume resume={sample} /></div>
    <div className="mx-auto mt-4 max-w-3xl px-4 text-center text-sm text-neutral-600">Made by <Link className="underline" href="/">aimorpher.com</Link></div>
  </main>;
}
