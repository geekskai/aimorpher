import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FullResume } from '@/components/resume/FullResume';
import { Metadata } from 'next';
import { getUserData } from './utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const { user_id, resume, clerkUser } = await getUserData(username);

  if (!user_id) {
    return {
      title: 'User Not Found | aimorpher.com',
      description: 'This user profile could not be found on aimorpher.com',
    };
  }

  if (!resume?.resumeData || resume.status !== 'live') {
    return {
      title: 'Resume Not Found | aimorpher.com',
      description: 'This resume could not be found on aimorpher.com',
    };
  }

  return {
    title: `${resume.resumeData.header.name}'s Resume | aimorpher.com`,
    description: resume.resumeData.summary,
    openGraph: {
      title: `${resume.resumeData.header.name}'s Resume | aimorpher.com`,
      description: resume.resumeData.summary,
      images: [
        {
          url: `https://aimorpher.com/${username}/og`,
          width: 1200,
          height: 630,
          alt: 'aimorpher.com Profile',
        },
      ],
    },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const { user_id, resume, clerkUser } = await getUserData(username);

  if (!user_id) redirect(`/?usernameNotFound=${username}`);
  if (!resume?.resumeData || resume.status !== 'live')
    redirect(`/?idNotFound=${user_id}`);

  const profilePicture = clerkUser?.imageUrl;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: resume.resumeData.header.name,
    image: profilePicture,
    jobTitle: resume.resumeData.header.shortAbout,
    description: resume.resumeData.summary,
    email:
      resume.resumeData.header.contacts.email &&
      `mailto:${resume.resumeData.header.contacts.email}`,
    url: `https://aimorpher.com/${username}`,
    skills: resume.resumeData.header.skills,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <FullResume resume={resume?.resumeData} profilePicture={profilePicture} />

      <div className="text-center mt-8 mb-4">
        <Link
          href={`/?ref=${username}`}
          className="text-design-gray font-mono text-sm"
        >
          Made by{' '}
          <span className="text-design-black underline underline-offset-2">
            aimorpher.com
          </span>
        </Link>
      </div>
    </>
  );
}
