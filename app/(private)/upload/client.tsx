'use client';

import { Button } from '@/components/ui/button';
import { Dropzone } from '@/components/ui/dropzone';
import { Linkedin, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useUserActions } from '@/hooks/useUserActions';
import { useEffect, useState } from 'react';
import { CustomSpinner } from '@/components/CustomSpinner';
import LoadingFallback from '@/components/LoadingFallback';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MAX_PDF_SIZE_BYTES } from '@/lib/config';
import { useFunnelAnalytics } from '@/hooks/useFunnelAnalytics';

type FileState =
  | { status: 'empty' }
  | { status: 'saved'; file: { name: string; url: string; size: number } };

export default function UploadPageClient({
  proIntent = false,
  quotaReached = false,
}: {
  proIntent?: boolean;
  quotaReached?: boolean;
}) {
  const router = useRouter();
  const plausible = useFunnelAnalytics();

  const { resumeQuery, uploadResumeMutation, deleteResumeMutation } =
    useUserActions();
  const [fileState, setFileState] = useState<FileState>({ status: 'empty' });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const resume = resumeQuery.data?.resume;

  // Update fileState whenever resume changes
  useEffect(() => {
    if (resume?.file?.url && resume.file.name && resume.file.size) {
      setFileState({
        status: 'saved',
        file: {
          name: resume.file.name,
          url: resume.file.url,
          size: resume.file.size,
        },
      });
    }
  }, [resume]);

  useEffect(() => {
    if (quotaReached) plausible('quota_reached', { props: { quota: 'ai_generation' } });
  }, [plausible, quotaReached]);

  const handleUploadFile = async (file: File) => {
    const source = file.name.toLowerCase().includes('linkedin')
      ? 'linkedin_pdf'
      : 'resume';
    plausible('upload_started', { props: { source } });
    try {
      await uploadResumeMutation.mutateAsync(file);
      plausible('upload_succeeded', { props: { source } });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload PDF',
      );
    }
  };

  const handleDeleteResume = async () => {
    try {
      await deleteResumeMutation.mutateAsync();
      setFileState({ status: 'empty' });
      setShowDeleteConfirmation(false);
      toast.success('Resume and uploaded PDF deleted');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete resume',
      );
    }
  };

  if (resumeQuery.isLoading) {
    return <LoadingFallback message="Loading..." />;
  }

  const isUpdating =
    resumeQuery.isPending ||
    uploadResumeMutation.isPending ||
    deleteResumeMutation.isPending;

  return (
    <div className="flex flex-col items-center flex-1 px-4 py-12 gap-6">
      {proIntent ? (
        <div className="w-full max-w-[438px] rounded-lg border border-[#aeb9ff] bg-[#eef1ff] p-4 text-left">
          <p className="font-semibold text-[#17204a]">You selected Aimorpher Pro.</p>
          <p className="mt-1 text-sm leading-6 text-[#4d5666]">
            Build your primary profile, then return to Pricing to open the
            secure Creem checkout. Monthly includes a one-time 7-day trial.
          </p>
        </div>
      ) : null}
      {quotaReached ? (
        <div
          role="alert"
          className="w-full max-w-[438px] rounded-lg border border-amber-300 bg-amber-50 p-4 text-left"
        >
          <p className="font-semibold text-amber-950">AI generation limit reached</p>
          <p className="mt-1 text-sm leading-6 text-amber-900">
            Your uploaded PDF is still saved. Wait for the next 30-day window or
            upgrade to Pro for 30 successful generations.
          </p>
          <a href="/pricing" className="mt-2 inline-block text-sm font-semibold underline">
            Compare plans
          </a>
        </div>
      ) : null}
      <div className="w-full max-w-[438px] text-center font-mono">
        <h1 className="text-base text-center pb-6">
          Upload a PDF of your LinkedIn or your resume and generate your
          personal site
        </h1>

        <div className="relative mx-2.5">
          {fileState.status !== 'empty' && (
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full z-10"
              disabled={isUpdating}
              aria-label="Delete uploaded resume"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}

          <Dropzone
            key={fileState.status === 'empty' ? 'empty' : fileState.file.url}
            accept={{ 'application/pdf': ['.pdf'] }}
            maxFiles={1}
            maxSize={MAX_PDF_SIZE_BYTES}
            disabled={fileState.status !== 'empty'}
            icon={
              fileState.status !== 'empty' ? (
                <img src="/uploaded-pdf.svg" className="h-6 w-6" />
              ) : (
                <Linkedin className="h-6 w-6 text-gray-600" />
              )
            }
            title={
              <span className="text-base font-bold text-center text-design-black">
                {fileState.status !== 'empty'
                  ? fileState.file.name
                  : 'Upload PDF'}
              </span>
            }
            description={
              <span className="text-xs font-light text-center text-design-gray">
                {fileState.status !== 'empty'
                  ? `${(fileState.file.size / 1024 / 1024).toFixed(2)} MB`
                  : 'Resume or LinkedIn'}
              </span>
            }
            isUploading={uploadResumeMutation.isPending}
            onDrop={(acceptedFiles) => {
              if (acceptedFiles[0]) handleUploadFile(acceptedFiles[0]);
            }}
            onDropRejected={() =>
              toast.error('Upload a PDF that is 10 MB or smaller')
            }
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="mt-3 hover:bg-white border border-transparent hover:border-gray-200 font-mono text-center cursor-help flex flex-row gap-1.5 justify-center mx-auto"
            >
              <span className="ml-1 inline-block w-4 h-4 rounded-full border border-gray-300 items-center justify-center text-xs cursor-help">
                i
              </span>
              <p className="text-xs text-center text-design-gray whitespace-normal">
                How to upload LinkedIn profile
              </p>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-[652px] text-center font-mono !p-0 gap-0">
            <DialogTitle className="font-mono text-base text-center text-design-gray px-7 py-4">
              Go to your profile → Click on “Resources” → Then “Save to PDF”
            </DialogTitle>
            <img src="/linkedin-save-to-pdf.png" className="h-auto w-full" />
          </DialogContent>
        </Dialog>
        <p className="mt-4 text-xs leading-5 text-design-gray">
          Your PDF is stored so you can retry and edit later. Its text is sent
          to Together AI through Helicone to generate your draft. Deleting the
          resume removes both the uploaded PDF and generated resume data.
        </p>
      </div>
      <div className="font-mono">
        <div className="relative">
          <Button
            className="px-4 py-3 h-auto bg-design-black hover:bg-design-black/95"
            disabled={fileState.status === 'empty' || isUpdating}
            onClick={() => {
              plausible('processing_started');
              sessionStorage.setItem('aimorpher:processing-started', 'true');
              router.push('/pdf');
            }}
          >
            {isUpdating ? (
              <>
                <CustomSpinner className="h-5 w-5 mr-2" />
                Processing...
              </>
            ) : (
              <>
                <img
                  src="/sparkle.png"
                  alt="Sparkle Icon"
                  className="h-5 w-5 mr-2"
                />
                Generate Website
              </>
            )}
          </Button>
          {fileState.status === 'empty' && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="absolute inset-0" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload a PDF to continue</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      <AlertDialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this resume?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the uploaded PDF and resume data. A
              published website will no longer be available.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteResumeMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleDeleteResume();
              }}
              disabled={deleteResumeMutation.isPending}
            >
              {deleteResumeMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
