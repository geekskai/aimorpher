import { generateObject } from 'ai';
import { createTogetherAI } from '@ai-sdk/togetherai';
import { ResumeDataSchema, type ResumeDataSchemaType } from '@/lib/resume';
import { RESUME_MODEL } from './generateResumeObject';
import { preservesSourceFacts } from './jobProfileFacts';

const togetherai = createTogetherAI({
  apiKey: process.env.TOGETHER_API_KEY ?? '',
  baseURL: 'https://together.helicone.ai/v1',
  headers: {
    'Helicone-Auth': `Bearer ${process.env.HELICONE_API_KEY}`,
    'Helicone-Property-AppName': 'aimorpher.com',
    'Helicone-Property-Feature': 'job-profile',
  },
});

export async function generateJobProfile(
  baseProfile: ResumeDataSchemaType,
  jobDescription: string,
): Promise<ResumeDataSchemaType | undefined> {
  try {
    const { object } = await generateObject({
      model: togetherai(RESUME_MODEL),
      maxRetries: 2,
      schema: ResumeDataSchema,
      prompt: `Create a job-specific professional profile from the source profile and target job description below.

NON-NEGOTIABLE FACT RULES:
- Never invent or add employers, roles, dates, degrees, projects, skills, achievements, metrics, contact details, or qualifications.
- Preserve all factual fields from the source. You may reorder existing skills, projects, and work entries for relevance.
- You may rewrite only the short professional introduction, summary, and existing work descriptions, without changing their factual meaning.
- If the job description requests experience absent from the source, do not claim it.
- Keep profileVersion, visibility, profileBlocks, contacts, dates, and URLs valid under the supplied schema.
- Return only the structured object requested by the schema.

SOURCE PROFILE:
${JSON.stringify(baseProfile)}

TARGET JOB DESCRIPTION:
${jobDescription}`,
    });

    const generated = ResumeDataSchema.parse(object);
    if (!preservesSourceFacts(baseProfile, generated)) {
      console.warn('Rejected job-specific profile because source facts changed');
      return undefined;
    }
    return generated;
  } catch (error) {
    console.warn('Unable to generate job-specific profile', error);
    return undefined;
  }
}
