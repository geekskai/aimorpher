import { describe, expect, it } from 'vitest';
import { ResumeDataSchema } from '@/lib/resume';
import { enforcePlanAccess } from '@/lib/plans';

const legacyResume = {
  header: {
    name: 'Alex Chen',
    shortAbout: 'Full-stack engineer',
    location: 'Toronto, Canada',
    contacts: {
      email: 'alex@example.com',
      phone: '+1 555 555 5555',
    },
    skills: ['TypeScript'],
  },
  summary: 'Builds reliable web products.',
  workExperience: [],
  education: [],
};

describe('professional profile schema', () => {
  it('adds safe defaults to legacy resume data', () => {
    const parsed = ResumeDataSchema.parse(legacyResume);

    expect(parsed).toMatchObject({
      profileVersion: 1,
      themeId: 'signal',
      visibility: {
        email: true,
        phone: true,
        location: true,
        education: true,
        resumeDownload: false,
      },
      profileBlocks: {
        projects: [],
        links: [],
        resumeDownloadUrl: null,
      },
    });
  });

  it('accepts professional projects and links with http URLs', () => {
    const parsed = ResumeDataSchema.parse({
      ...legacyResume,
      profileBlocks: {
        projects: [
          {
            id: 'project-1',
            name: 'Search toolkit',
            description: 'Reduced indexing latency by 40%.',
            url: 'https://example.com',
            sourceUrl: 'https://github.com/example/search-toolkit',
            technologies: ['TypeScript', 'Postgres'],
          },
        ],
        links: [
          {
            id: 'link-1',
            label: 'Technical writing',
            url: 'https://example.com/writing',
            kind: 'writing',
          },
        ],
      },
    });

    expect(parsed.profileBlocks.projects).toHaveLength(1);
    expect(parsed.profileBlocks.links).toHaveLength(1);
  });

  it('rejects executable or non-web URLs', () => {
    expect(() =>
      ResumeDataSchema.parse({
        ...legacyResume,
        profileBlocks: {
          projects: [],
          links: [
            {
              id: 'unsafe-link',
              label: 'Unsafe',
              url: 'javascript:alert(1)',
              kind: 'other',
            },
          ],
        },
      }),
    ).toThrow();
  });

  it('enforces theme entitlements without trusting client input', () => {
    const studioResume = ResumeDataSchema.parse({
      ...legacyResume,
      themeId: 'studio',
    });

    expect(enforcePlanAccess(studioResume, 'free').themeId).toBe('signal');
    expect(enforcePlanAccess(studioResume, 'pro').themeId).toBe('studio');
  });
});
