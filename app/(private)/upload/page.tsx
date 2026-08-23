import UploadPageClient from './client';

export default async function UploadPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const { intent } = await searchParams;
  return <UploadPageClient proIntent={intent === 'pro'} />;
}
