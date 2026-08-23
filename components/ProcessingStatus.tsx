'use client';

import { Check, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type ProcessingStage = 'read' | 'generate' | 'complete';

const steps = [
  { id: 'upload', label: 'PDF uploaded' },
  { id: 'read', label: 'Reading PDF content' },
  { id: 'generate', label: 'Generating your website with AI' },
  { id: 'complete', label: 'Saving your editable draft' },
] as const;

const stageIndex: Record<ProcessingStage, number> = {
  read: 1,
  generate: 2,
  complete: 4,
};

export default function ProcessingStatus({
  initialStage,
}: {
  initialStage: Exclude<ProcessingStage, 'complete'>;
}) {
  const [stage, setStage] = useState<ProcessingStage>(initialStage);

  useEffect(() => {
    let cancelled = false;

    const refreshStage = async () => {
      try {
        const response = await fetch('/api/resume', { cache: 'no-store' });
        if (!response.ok || cancelled) return;

        const { resume } = await response.json();
        if (resume?.resumeData) {
          setStage('complete');
        } else if (resume?.fileContent) {
          setStage('generate');
        }
      } catch {
        // The route-level error boundary owns recovery if processing fails.
      }
    };

    refreshStage();
    const interval = window.setInterval(refreshStage, 1500);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const activeIndex = stageIndex[stage];

  return (
    <div
      className="flex min-h-[70vh] items-center justify-center px-4"
      aria-live="polite"
      aria-busy={stage !== 'complete'}
    >
      <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="font-mono text-xl font-bold text-design-black">
          Creating your website
        </h1>
        <p className="mt-2 text-sm text-design-gray">
          Keep this page open. Your original PDF remains available if a step
          needs to be retried.
        </p>

        <ol className="mt-6 space-y-4">
          {steps.map((step, index) => {
            const isComplete = index < activeIndex;
            const isActive = index === activeIndex;

            return (
              <li key={step.id} className="flex items-center gap-3">
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-full border border-neutral-300"
                  aria-hidden="true"
                >
                  {isComplete ? (
                    <Check className="size-4 text-green-700" />
                  ) : isActive ? (
                    <Loader2 className="size-4 animate-spin text-design-black motion-reduce:animate-none" />
                  ) : (
                    <span className="size-2 rounded-full bg-neutral-300" />
                  )}
                </span>
                <span
                  className={
                    isComplete || isActive
                      ? 'text-sm text-design-black'
                      : 'text-sm text-neutral-400'
                  }
                >
                  {step.label}
                  {isActive && <span className="sr-only">, in progress</span>}
                  {isComplete && <span className="sr-only">, complete</span>}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
