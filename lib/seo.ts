import type { MetadataRoute } from 'next';
import type { ResumeDataSchemaType } from '@/lib/resume';

export const SITE_URL = 'https://aimorpher.com';

export const INDEXABLE_STATIC_PATHS = [
  '',
  '/pricing',
  '/sample',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/refund-policy',
] as const;

export function absoluteUrl(path = ''): string {
  return new URL(path || '/', SITE_URL).toString();
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function buildSitemapEntries(
  liveUsernames: readonly string[],
): MetadataRoute.Sitemap {
  const staticEntries = INDEXABLE_STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
  }));
  const profileEntries = [...new Set(liveUsernames)]
    .sort((left, right) => left.localeCompare(right))
    .map((username) => ({
      url: absoluteUrl(`/${encodeURIComponent(username)}`),
    }));

  return [...staticEntries, ...profileEntries];
}

export function buildHomeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Aimorpher',
        url: SITE_URL,
        logo: absoluteUrl('/logo.svg'),
        email: 'support@aimorpher.com',
        sameAs: [
          'https://github.com/geekskai/aimorpher',
          'https://x.com/KaiGeeks',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: 'Aimorpher',
        url: SITE_URL,
        description:
          'A resume website builder for technical job seekers and developers.',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'WebApplication',
        '@id': `${SITE_URL}/#application`,
        name: 'Aimorpher',
        url: SITE_URL,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description:
          'Turn a PDF resume into an editable professional website for technical hiring.',
        featureList: [
          'PDF resume import',
          'Editable professional profile',
          'Contact visibility controls',
          'Job-specific profile versions',
        ],
        offers: [
          {
            '@type': 'Offer',
            name: 'Free',
            price: '0',
            priceCurrency: 'USD',
            url: absoluteUrl('/pricing'),
          },
          {
            '@type': 'Offer',
            name: 'Pro Monthly',
            price: '12',
            priceCurrency: 'USD',
            url: absoluteUrl('/pricing'),
          },
          {
            '@type': 'Offer',
            name: 'Pro Annual',
            price: '96',
            priceCurrency: 'USD',
            url: absoluteUrl('/pricing'),
          },
        ],
        provider: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  };
}

function toHttpUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function toSocialUrl(
  value: string | null | undefined,
  baseUrl: string,
): string | undefined {
  if (!value) return undefined;
  const fullUrl = toHttpUrl(value);
  if (fullUrl) return fullUrl;
  const username = value.trim().replace(/^@/, '');
  return username ? `${baseUrl}/${encodeURIComponent(username)}` : undefined;
}

export function buildProfilePageJsonLd({
  username,
  resume,
  profilePicture,
}: {
  username: string;
  resume: ResumeDataSchemaType;
  profilePicture?: string;
}) {
  const profileUrl = absoluteUrl(`/${encodeURIComponent(username)}`);
  const contacts = resume.header.contacts;
  const sameAs = [
    toHttpUrl(contacts.website),
    toSocialUrl(contacts.github, 'https://github.com'),
    toSocialUrl(contacts.linkedin, 'https://www.linkedin.com/in'),
    toSocialUrl(contacts.twitter, 'https://x.com'),
  ].filter((url): url is string => Boolean(url));
  const visibleEmail =
    resume.visibility.email && contacts.email
      ? `mailto:${contacts.email}`
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${profileUrl}#profile-page`,
    url: profileUrl,
    name: `${resume.header.name}'s professional profile`,
    description: resume.summary,
    mainEntity: {
      '@type': 'Person',
      '@id': `${profileUrl}#person`,
      name: resume.header.name,
      url: profileUrl,
      jobTitle: resume.header.shortAbout,
      description: resume.summary,
      skills: resume.header.skills,
      ...(profilePicture ? { image: profilePicture } : {}),
      ...(visibleEmail ? { email: visibleEmail } : {}),
      ...(sameAs.length > 0 ? { sameAs } : {}),
    },
  };
}

export function buildContactPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${absoluteUrl('/contact')}#contact-page`,
    url: absoluteUrl('/contact'),
    name: 'Contact Aimorpher',
    description: 'Contact Aimorpher for product, billing, or privacy support.',
    mainEntity: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Aimorpher',
      url: SITE_URL,
      email: 'support@aimorpher.com',
    },
  };
}
