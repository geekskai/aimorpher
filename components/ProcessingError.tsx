'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProcessingError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-6">
        <h1 className="font-mono text-xl font-bold text-red-950">
          We couldn&apos;t finish your website
        </h1>
        <p className="mt-2 text-sm text-red-900">
          Your uploaded PDF is still saved. Retry this step, or return to the
          upload page to replace or delete it.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={reset}>Retry</Button>
          <Button variant="outline" asChild>
            <Link href="/upload">Back to upload</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
