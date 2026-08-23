import { describe, expect, it } from 'vitest';
import { ResumeDataSchema } from '@/lib/resume';
import { preservesSourceFacts } from '@/lib/server/ai/jobProfileFacts';

const source = ResumeDataSchema.parse({
  header: { name: 'Ada Lovelace', shortAbout: 'Engineer', location: 'London, UK', contacts: { email: 'ada@example.com' }, skills: ['Math', 'Writing'] },
  summary: 'Original summary',
  workExperience: [
    { company: 'Analytical Engines', location: 'London, UK', contract: 'Full-time', title: 'Engineer', start: '1842-01-01', end: null, description: 'Original description' },
  ],
  education: [{ school: 'Home', degree: 'Mathematics', start: '1830', end: '1835' }],
});

describe('job-profile fact preservation', () => {
  it('allows relevance rewrites without changing facts', () => {
    const generated = { ...source, summary: 'Relevant summary', header: { ...source.header, shortAbout: 'Mathematical engineer', skills: [...source.header.skills].reverse() }, workExperience: source.workExperience.map((work) => ({ ...work, description: 'Relevant description' })) };
    expect(preservesSourceFacts(source, generated)).toBe(true);
  });

  it('rejects invented skills and changed employment facts', () => {
    expect(preservesSourceFacts(source, { ...source, header: { ...source.header, skills: [...source.header.skills, 'Rust'] } })).toBe(false);
    expect(preservesSourceFacts(source, { ...source, workExperience: source.workExperience.map((work) => ({ ...work, title: 'Director' })) })).toBe(false);
  });
});
