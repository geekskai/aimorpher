import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FullResume } from '@/components/resume/FullResume';
import { Metadata } from 'next';
import { getUserData } from './utils';
import { ProfileViewTracker } from '@/components/ProfileViewTracker';
import { absoluteUrl, buildProfilePageJsonLd, serializeJsonLd } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const { user_id, resume, clerkUser } = await getUserData(username);

  if (!user_id) {
    return {
      title: 'Profile Not Found',
      description: 'This professional profile could not be found on Aimorpher.',
      robots: { index: false, follow: false },
    };
  }

  if (!resume?.resumeData || resume.status !== 'live') {
    return {
      title: 'Profile Not Found',
      description: 'This professional profile could not be found on Aimorpher.',
      robots: { index: false, follow: false },
    };
  }

  const title = `${resume.resumeData.header.name}'s Professional Profile`;
  const profileUrl = absoluteUrl(`/${encodeURIComponent(username)}`);
  const imageUrl = absoluteUrl(`/${encodeURIComponent(username)}/og`);

  return {
    title,
    description: resume.resumeData.summary,
    alternates: { canonical: profileUrl },
    openGraph: {
      type: 'profile',
      url: profileUrl,
      title,
      description: resume.resumeData.summary,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${resume.resumeData.header.name}'s Aimorpher profile`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: resume.resumeData.summary,
      images: [imageUrl],
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

  if (!user_id || !resume?.resumeData || resume.status !== 'live') notFound();

  const profilePicture = clerkUser?.imageUrl;

  const jsonLd = buildProfilePageJsonLd({
    username,
    resume: resume.resumeData,
    profilePicture,
  });

  return (
    <>
      <ProfileViewTracker username={username} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <FullResume resume={resume?.resumeData} profilePicture={profilePicture} />

      {resume.plan === 'free' ? (
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
      ) : null}
    </>
  );
}
