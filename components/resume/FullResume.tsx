import LoadingFallback from '../LoadingFallback';
import { ResumeData } from '../../lib/server/redisActions';
import { Education } from './Education';
import { Header } from './Header';
import { Skills } from './Skills';
import { Summary } from './Summary';
import { WorkExperience } from './WorkExperience';
import { Projects } from './Projects';
import { ProfileLinks } from './ProfileLinks';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';

const themeClasses: Record<ResumeData['themeId'], string> = {
  signal: 'bg-white',
  studio: 'rounded-3xl bg-[#f1f5ff] px-6 md:px-10 ring-1 ring-[#d8e1ff]',
  terminal:
    'border-l-[6px] border-[#198754] bg-[#f4f7f5] px-6 md:px-10 shadow-[0_0_0_1px_#dce5df]',
};

export const FullResume = ({
  resume,
  profilePicture,
}: {
  resume?: ResumeData | null;
  profilePicture?: string;
}) => {
  if (!resume) {
    return <LoadingFallback message="Loading Resume..." />;
  }

  return (
    <section
      className={cn(
        'mx-auto my-8 w-full max-w-2xl space-y-8 px-4 py-2 print:space-y-4 print:bg-white print:px-4 print:shadow-none print:ring-0',
        themeClasses[resume.themeId],
      )}
      aria-label="Resume Content"
    >
      <Header
        header={resume.header}
        picture={profilePicture}
        visibility={resume.visibility}
      />

      <div className="flex flex-col gap-6">
        <Summary summary={resume?.summary} />

        <Projects projects={resume.profileBlocks.projects} />

        <WorkExperience work={resume?.workExperience} />

        {resume.visibility.education ? (
          <Education educations={resume.education} />
        ) : null}

        <Skills skills={resume.header.skills} />

        <ProfileLinks links={resume.profileBlocks.links} />

        {resume.visibility.resumeDownload &&
        resume.profileBlocks.resumeDownloadUrl ? (
          <a
            href={resume.profileBlocks.resumeDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 self-start rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#050914] print:hidden"
          >
            <Download className="size-4" aria-hidden="true" /> Download resume
          </a>
        ) : null}
      </div>
    </section>
  );
};
