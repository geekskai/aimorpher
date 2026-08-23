import UploadPageClient from './client';

export default async function UploadPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string; error?: string }>;
}) {
  const { intent, error } = await searchParams;
  return (
    <UploadPageClient
      proIntent={intent === 'pro'}
      quotaReached={error === 'aiQuotaReached'}
    />
  );
}
