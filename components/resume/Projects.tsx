import type { ResumeDataSchemaType } from '@/lib/resume';
import { ExternalLink, Github } from 'lucide-react';
import { Section } from '@/components/ui/section';

export function Projects({
  projects,
}: {
  projects: ResumeDataSchemaType['profileBlocks']['projects'];
}) {
  if (projects.length === 0) return null;

  return (
    <Section>
      <h2 className="text-xl font-bold" id="projects-section">
        Selected Projects
      </h2>
      <div className="grid gap-3 sm:grid-cols-2" aria-labelledby="projects-section">
        {projects.map((project) => (
          <article
            key={project.id}
            className="flex flex-col rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:only:col-span-2"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-[#050914]">{project.name}</h3>
              <div className="flex gap-1 print:hidden">
                {project.sourceUrl ? (
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View source code for ${project.name}`}
                    className="inline-flex size-11 items-center justify-center rounded-lg text-[#596170] transition-colors hover:bg-neutral-100 hover:text-[#050914] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#050914]"
                  >
                    <Github className="size-4" aria-hidden="true" />
                  </a>
                ) : null}
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.name}`}
                    className="inline-flex size-11 items-center justify-center rounded-lg text-[#596170] transition-colors hover:bg-neutral-100 hover:text-[#050914] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#050914]"
                  >
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </div>
            <p className="mt-2 flex-1 text-base leading-7 text-[#596170]">
              {project.description}
            </p>
            {project.technologies.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
                {project.technologies.map((technology) => (
                  <li
                    key={technology}
                    className="rounded bg-neutral-100 px-2 py-1 font-mono text-[11px] text-[#54575e]"
                  >
                    {technology}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  );
}
