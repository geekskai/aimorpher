import { auth } from '@clerk/nextjs/server';
import { getResume, storeResume } from '../../../lib/server/redisActions';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import LoadingFallback from '../../../components/LoadingFallback';
import { scrapePdfContent } from '@/lib/server/scrapePdfContent';
import { deleteR2File } from '@/lib/server/deleteR2File';

async function PdfProcessing({ userId }: { userId: string }) {
  const resume = await getResume(userId);

  if (!resume || !resume.file || !resume.file.url) redirect('/upload');

  if (!resume.fileContent) {
    const fileContent = await scrapePdfContent(resume?.file.url);

    // check if the fileContent was good or bad, if bad we redirect to the upload page and delete the object from R2 and redis
    const isContentBad = false; // await isFileContentBad(fileContent);

    if (isContentBad) {
      await deleteR2File({
        key: resume.file.key,
      });

      await storeResume(userId, {
        ...resume,
        file: undefined,
        fileContent: null,
        resumeData: null,
      });

      redirect('/upload');
    }

    await storeResume(userId, {
      ...resume,
      fileContent: fileContent,
      resumeData: null,
    });
  }

  redirect('/preview');
  return <></>; // This line will never be reached due to the redirect
}

export default async function Pdf() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  return (
    <>
      <Suspense
        fallback={
          <LoadingFallback message="Reading your resume carefully..." />
        }
      >
        <PdfProcessing userId={userId} />
      </Suspense>
    </>
  );
}
