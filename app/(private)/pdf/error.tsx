'use client';

import ProcessingError from '@/components/ProcessingError';

export default function PdfError({ reset }: { reset: () => void }) {
  return <ProcessingError reset={reset} />;
}
