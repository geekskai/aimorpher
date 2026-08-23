import type { ResumeDataSchemaType } from '@/lib/resume';

const stable = (value: unknown) => JSON.stringify(value);
const sorted = (values: string[]) => [...values].sort((a, b) => a.localeCompare(b));

export function preservesSourceFacts(
  source: ResumeDataSchemaType,
  generated: ResumeDataSchemaType,
): boolean {
  if (source.profileVersion !== generated.profileVersion) return false;
  if (source.themeId !== generated.themeId) return false;
  if (stable(source.visibility) !== stable(generated.visibility)) return false;
  if (stable(source.profileBlocks) !== stable(generated.profileBlocks)) return false;
  if (source.header.name !== generated.header.name) return false;
  if (source.header.location !== generated.header.location) return false;
  if (stable(source.header.contacts) !== stable(generated.header.contacts)) return false;
  if (stable(sorted(source.header.skills)) !== stable(sorted(generated.header.skills))) return false;
  if (stable(source.education) !== stable(generated.education)) return false;
  if (source.workExperience.length !== generated.workExperience.length) return false;

  const identity = (work: ResumeDataSchemaType['workExperience'][number]) =>
    stable({ company: work.company, link: work.link, location: work.location, contract: work.contract, title: work.title, start: work.start, end: work.end });
  return stable(source.workExperience.map(identity).sort()) === stable(generated.workExperience.map(identity).sort());
}
