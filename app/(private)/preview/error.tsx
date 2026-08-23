'use client';

import ProcessingError from '@/components/ProcessingError';

export default function PreviewError({ reset }: { reset: () => void }) {
  return <ProcessingError reset={reset} />;
}
