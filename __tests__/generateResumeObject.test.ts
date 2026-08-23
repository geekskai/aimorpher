import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { generateObject } from 'ai';
import { generateResumeObject } from '@/lib/server/ai/generateResumeObject';

vi.mock('ai', () => ({
  generateObject: vi.fn(),
}));

vi.mock('@ai-sdk/togetherai', () => ({
  createTogetherAI: () => () => 'mock-model',
}));

const generatedResume = {
  header: {
    name: 'John Doe',
    shortAbout: 'Software engineer',
    location: 'New York, USA',
    contacts: {},
    skills: ['TypeScript'],
  },
  summary: 'Experienced software engineer.',
  workExperience: [],
  education: [],
};

describe('generateResumeObject', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it('returns validated structured resume data', async () => {
    vi.mocked(generateObject).mockResolvedValue({
      object: generatedResume,
    } as never);

    const result = await generateResumeObject(
      'John Doe\nSoftware Engineer\nNew York, USA',
    );

    expect(result).toMatchObject(generatedResume);
    expect(result).toMatchObject({
      profileVersion: 1,
      themeId: 'signal',
      profileBlocks: { projects: [], links: [] },
    });
    expect(generateObject).toHaveBeenCalledOnce();
  });

  it('returns undefined when the provider fails', async () => {
    vi.mocked(generateObject).mockRejectedValue(new Error('Provider error'));

    await expect(generateResumeObject('John Doe')).resolves.toBeUndefined();
  });

  it('returns undefined when generated data does not match the schema', async () => {
    vi.mocked(generateObject).mockResolvedValue({ object: {} } as never);

    await expect(generateResumeObject('John Doe')).resolves.toBeUndefined();
  });
});
