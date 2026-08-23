import type { ResumeDataSchemaType } from '@/lib/resume';
import { ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/ui/section';

export function ProfileLinks({
  links,
}: {
  links: ResumeDataSchemaType['profileBlocks']['links'];
}) {
  if (links.length === 0) return null;

  return (
    <Section className="print:hidden">
      <h2 className="text-xl font-bold" id="professional-links-section">
        Professional Links
      </h2>
      <div
        className="grid gap-2 sm:grid-cols-2"
        aria-labelledby="professional-links-section"
      >
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-12 items-center justify-between rounded-lg border border-neutral-200 bg-white/80 px-4 py-3 text-sm font-semibold text-[#050914] transition-colors hover:border-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#050914]"
          >
            <span>
              {link.label}
              <span className="ml-2 font-mono text-[10px] font-normal uppercase tracking-wide text-[#8b93a1]">
                {link.kind}
              </span>
            </span>
            <ArrowUpRight
              className="size-4 text-[#8b93a1] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        ))}
      </div>
    </Section>
  );
}
