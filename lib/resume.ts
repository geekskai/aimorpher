import { z } from 'zod';

export const PROFILE_SCHEMA_VERSION = 1 as const;

export const ProfileThemeSchema = z.enum(['signal', 'studio', 'terminal']);

const isHttpUrl = (value: string) => {
  try {
    const protocol = new URL(value).protocol;
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};

const HttpUrlSchema = z
  .string()
  .trim()
  .url()
  .refine(isHttpUrl, 'Only http and https URLs are supported');

export const ProfileLinkSchema = z.object({
  id: z.string().min(1).max(80),
  label: z.string().trim().min(1).max(48),
  url: HttpUrlSchema,
  kind: z
    .enum(['portfolio', 'github', 'demo', 'writing', 'other'])
    .default('other'),
});

export const ProfileProjectSchema = z.object({
  id: z.string().min(1).max(80),
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(320),
  url: HttpUrlSchema.nullish(),
  sourceUrl: HttpUrlSchema.nullish(),
  technologies: z.array(z.string().trim().min(1).max(32)).max(8).default([]),
});

export const ProfileVisibilitySchema = z.object({
  email: z.boolean().default(true),
  phone: z.boolean().default(true),
  location: z.boolean().default(true),
  education: z.boolean().default(true),
  resumeDownload: z.boolean().default(false),
});

export const ProfileBlocksSchema = z.object({
  projects: z.array(ProfileProjectSchema).max(6).default([]),
  links: z.array(ProfileLinkSchema).max(8).default([]),
  resumeDownloadUrl: HttpUrlSchema.nullish(),
});

export const DEFAULT_PROFILE_VISIBILITY = {
  email: true,
  phone: true,
  location: true,
  education: true,
  resumeDownload: false,
} as const;

export const DEFAULT_PROFILE_BLOCKS = {
  projects: [],
  links: [],
  resumeDownloadUrl: null,
};

const HeaderContactsSchema = z.object({
  website: z.string().nullable().describe('Personal website or portfolio URL').optional(),
  email: z.string().nullable().describe('Email address').optional(),
  phone: z.string().nullable().describe('Phone number').optional(),
  twitter: z.string().nullable().describe('Twitter/X username').optional(),
  linkedin: z.string().nullable().describe('LinkedIn username').optional(),
  github: z.string().nullable().describe('GitHub username').optional(),
});

const HeaderSection = z.object({
  name: z.string(),
  shortAbout: z.string().describe('Short description of your profile'),
  location: z
    .string()
    .describe("Location with format 'City, Country'")
    .optional(),
  contacts: HeaderContactsSchema,
  skills: z
    .array(z.string())
    .describe('Skills used within the different jobs the user has had.'),
});

const SummarySection = z.string().describe('Summary of your profile');

const WorkExperienceSection = z.array(
  z.object({
    company: z.string().describe('Company name'),
     link: z.string().optional().describe('Company website URL'),
    location: z
      .string()
      .describe(
        "Location with format 'City, Country' or could be Hybrid or Remote"
      ),
    contract: z
      .string()
      .describe('Type of work contract like Full-time, Part-time, Contract'),
    title: z.string().describe('Job title'),
    start: z.string().describe("Start date in format 'YYYY-MM-DD'"),
     end: z
       .string()
       .nullable()
       .describe("End date in format 'YYYY-MM-DD' or null if current"),
    description: z.string().describe('Job description'),
  })
);

const EducationSection = z.array(
  z.object({
    school: z.string().describe('School or university name'),
    degree: z.string().describe('Degree or certification obtained'),
    start: z.string().describe('Start year'),
    end: z.string().describe('End year'),
  })
);

export const ResumeDataSchema = z.object({
  profileVersion: z.literal(PROFILE_SCHEMA_VERSION).default(PROFILE_SCHEMA_VERSION),
  themeId: ProfileThemeSchema.default('signal'),
  visibility: ProfileVisibilitySchema.default(DEFAULT_PROFILE_VISIBILITY),
  profileBlocks: ProfileBlocksSchema.default(DEFAULT_PROFILE_BLOCKS),
  header: HeaderSection,
  summary: SummarySection,
  workExperience: WorkExperienceSection,
  education: EducationSection,
});

export type ResumeDataSchemaType = z.infer<typeof ResumeDataSchema>;
