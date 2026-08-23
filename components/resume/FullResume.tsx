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
  signal: 'max-w-2xl bg-white',
  studio:
    'max-w-5xl rounded-[28px] border border-[#dfe3ea] bg-white px-5 py-6 shadow-[0_18px_60px_rgba(45,55,76,0.12)] sm:px-8 sm:py-8 lg:px-12 lg:py-10',
  terminal:
    'max-w-2xl border-l-[6px] border-[#198754] bg-[#f4f7f5] px-6 md:px-10 shadow-[0_0_0_1px_#dce5df]',
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

  const isStudio = resume.themeId === 'studio';

  const primarySections = (
    <div className="flex min-w-0 flex-col gap-7">
      <Summary summary={resume.summary} />
      <Projects projects={resume.profileBlocks.projects} />
      <WorkExperience work={resume.workExperience} />
    </div>
  );

  const supportingSections = (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-6',
        isStudio &&
          'rounded-2xl border border-[#e1e5ec] bg-[#f7f8fb] p-5 sm:p-6',
      )}
    >
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
  );

  return (
    <section
      className={cn(
        'mx-auto my-8 w-full space-y-8 px-4 py-2 print:max-w-2xl print:space-y-4 print:border-0 print:bg-white print:px-4 print:shadow-none print:ring-0',
        themeClasses[resume.themeId],
      )}
      aria-label="Resume Content"
    >
      {isStudio ? (
        <div className="flex items-center justify-between border-b border-[#e1e5ec] pb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#667085] print:hidden">
          <span>Public profile</span>
          <span className="inline-flex items-center gap-2 text-[#147a42]">
            <span className="size-2 rounded-full bg-[#22a559]" aria-hidden="true" />
            Available online
          </span>
        </div>
      ) : null}

      <div className={cn(isStudio && 'border-b border-[#e1e5ec] pb-8')}>
        <Header
          header={resume.header}
          picture={profilePicture}
          visibility={resume.visibility}
          variant={isStudio ? 'studio' : 'default'}
        />
      </div>

      {isStudio ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(16rem,0.75fr)] lg:items-start lg:gap-10">
          {primarySections}
          {supportingSections}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {primarySections}
          {supportingSections}
        </div>
      )}
    </section>
  );
};
