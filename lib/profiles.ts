import { z } from 'zod';
import { ResumeDataSchema } from '@/lib/resume';

export const PROFILE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const JobProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().min(1),
  slug: z
    .string()
    .min(2)
    .max(48)
    .regex(PROFILE_SLUG_PATTERN),
  label: z.string().trim().min(1).max(80),
  status: z.enum(['live', 'draft']).default('draft'),
  resumeData: ResumeDataSchema,
  lockedAt: z.string().datetime().nullable().default(null),
  expiresAt: z.string().datetime().nullable().default(null),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type JobProfile = z.infer<typeof JobProfileSchema>;

export const CreateJobProfileSchema = z.object({
  label: z.string().trim().min(1).max(80),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2)
    .max(48)
    .regex(PROFILE_SLUG_PATTERN),
  jobDescription: z.string().trim().min(80).max(20_000),
});
