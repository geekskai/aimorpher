import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ResumeDataSchema } from '@/lib/resume';
import { PRIVATE_ROUTES, RESERVED_USERNAMES } from '@/lib/routes';
import {
  INDEXABLE_STATIC_PATHS,
  buildContactPageJsonLd,
  buildHomeJsonLd,
  buildProfilePageJsonLd,
  buildSitemapEntries,
  serializeJsonLd,
} from '@/lib/seo';

const resume = ResumeDataSchema.parse({
  header: {
    name: 'Alex Chen',
    shortAbout: 'Full-stack engineer',
    contacts: {
      website: 'https://alex.example.com',
      email: 'alex@example.com',
      github: 'alexchen',
      linkedin: 'alexchen',
    },
    skills: ['TypeScript'],
  },
  summary: 'Builds reliable web products.',
  workExperience: [],
  education: [],
});

describe('SEO foundations', () => {
  it('builds a deterministic sitemap with only static pages and deduplicated primary profiles', () => {
    const entries = buildSitemapEntries(['zoe', 'alex', 'zoe']);
    const urls = entries.map(({ url }) => url);

    expect(urls.slice(0, INDEXABLE_STATIC_PATHS.length)).toEqual([
      'https://aimorpher.com/',
      'https://aimorpher.com/pricing',
      'https://aimorpher.com/sample',
      'https://aimorpher.com/about',
      'https://aimorpher.com/contact',
      'https://aimorpher.com/terms',
      'https://aimorpher.com/privacy',
      'https://aimorpher.com/refund-policy',
    ]);
    expect(urls.slice(INDEXABLE_STATIC_PATHS.length)).toEqual([
      'https://aimorpher.com/alex',
      'https://aimorpher.com/zoe',
    ]);
    expect(urls.some((url) => /upload|preview|pdf|api/.test(url))).toBe(false);
  });

  it('reserves every fixed public or private top-level route from usernames', () => {
    expect(RESERVED_USERNAMES).toEqual(
      expect.arrayContaining([
        'upload',
        'preview',
        'pdf',
        'api',
        'pricing',
        'sample',
        'about',
        'contact',
        'terms',
        'privacy',
        'refund-policy',
      ]),
    );
    expect(PRIVATE_ROUTES).toEqual(['preview', 'api', 'upload', 'pdf']);
  });

  it('describes the product and real pricing without review or FAQ markup', () => {
    const jsonLd = buildHomeJsonLd();
    const serialized = JSON.stringify(jsonLd);

    expect(serialized).toContain('WebSite');
    expect(serialized).toContain('WebApplication');
    expect(serialized).toContain('Pro Monthly');
    expect(serialized).toContain('"price":"12"');
    expect(serialized).not.toContain('aggregateRating');
    expect(serialized).not.toContain('FAQPage');
  });

  it('wraps a visible person in ProfilePage schema and omits private email', () => {
    const publicSchema = buildProfilePageJsonLd({
      username: 'alex',
      resume,
      profilePicture: 'https://images.example.com/alex.png',
    });
    const privateSchema = buildProfilePageJsonLd({
      username: 'alex',
      resume: {
        ...resume,
        visibility: { ...resume.visibility, email: false },
      },
    });

    expect(publicSchema).toMatchObject({
      '@type': 'ProfilePage',
      url: 'https://aimorpher.com/alex',
      mainEntity: {
        '@type': 'Person',
        email: 'mailto:alex@example.com',
        sameAs: expect.arrayContaining([
          'https://alex.example.com/',
          'https://github.com/alexchen',
        ]),
      },
    });
    expect(privateSchema.mainEntity).not.toHaveProperty('email');
    expect(JSON.stringify(privateSchema)).not.toContain('false');
  });

  it('escapes user-authored markup before embedding JSON-LD in a script', () => {
    expect(serializeJsonLd({ name: '</script><script>alert(1)</script>' }))
      .toBe('{"name":"\\u003c/script>\\u003cscript>alert(1)\\u003c/script>"}');
  });

  it('exposes ContactPage schema and sitemap discovery while keeping private routes blocked', () => {
    const contactSchema = buildContactPageJsonLd();
    const robots = readFileSync(new URL('../app/robots.txt', import.meta.url), 'utf8');

    expect(contactSchema).toMatchObject({
      '@type': 'ContactPage',
      url: 'https://aimorpher.com/contact',
      mainEntity: { email: 'support@aimorpher.com' },
    });
    expect(robots).toContain('Sitemap: https://aimorpher.com/sitemap.xml');
    expect(robots).toContain('Disallow: /upload');
    expect(robots).toContain('Disallow: /api/');
  });

  it('uses a real 404 for missing primary profiles and noindex for job-specific versions', () => {
    const primaryRoute = readFileSync(
      new URL('../app/[username]/page.tsx', import.meta.url),
      'utf8',
    );
    const jobRoute = readFileSync(
      new URL('../app/[username]/[versionSlug]/page.tsx', import.meta.url),
      'utf8',
    );

    expect(primaryRoute).toContain('notFound()');
    expect(primaryRoute).not.toContain('redirect(');
    expect(jobRoute).toContain('robots: { index: false, follow: true }');
  });
});
