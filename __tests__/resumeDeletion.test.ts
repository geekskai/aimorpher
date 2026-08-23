import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { currentUser } from '@clerk/nextjs/server';
import {
  deleteResume,
  getResume,
  storeResume,
} from '@/lib/server/redisActions';
import { deleteR2File } from '@/lib/server/deleteR2File';
import { DELETE, POST } from '@/app/api/resume/route';

vi.mock('@clerk/nextjs/server', () => ({
  currentUser: vi.fn(),
}));

vi.mock('@/lib/server/redisActions', () => ({
  deleteResume: vi.fn(),
  getResume: vi.fn(),
  storeResume: vi.fn(),
}));

vi.mock('@/lib/server/deleteR2File', () => ({
  deleteR2File: vi.fn(),
}));

describe('DELETE /api/resume', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it('requires authentication', async () => {
    vi.mocked(currentUser).mockResolvedValue(null);

    const response = await DELETE();

    expect(response.status).toBe(401);
    expect(deleteR2File).not.toHaveBeenCalled();
    expect(deleteResume).not.toHaveBeenCalled();
  });

  it('deletes the R2 object before the Redis resume', async () => {
    vi.mocked(currentUser).mockResolvedValue({ id: 'user_123' } as never);
    vi.mocked(getResume).mockResolvedValue({
      status: 'live',
      file: {
        name: 'resume.pdf',
        url: 'https://r2.example/resume.pdf',
        size: 100,
        bucket: 'resumes',
        key: 'uploads/user_123/resume.pdf',
      },
    });

    const response = await DELETE();

    expect(response.status).toBe(200);
    expect(deleteR2File).toHaveBeenCalledWith({
      key: 'uploads/user_123/resume.pdf',
    });
    expect(deleteResume).toHaveBeenCalledWith('user_123');
    expect(
      vi.mocked(deleteR2File).mock.invocationCallOrder[0],
    ).toBeLessThan(vi.mocked(deleteResume).mock.invocationCallOrder[0]);
  });

  it('keeps the Redis record when R2 deletion fails', async () => {
    vi.mocked(currentUser).mockResolvedValue({ id: 'user_123' } as never);
    vi.mocked(getResume).mockResolvedValue({
      status: 'draft',
      file: {
        name: 'resume.pdf',
        url: 'https://r2.example/resume.pdf',
        size: 100,
        bucket: 'resumes',
        key: 'uploads/user_123/resume.pdf',
      },
    });
    vi.mocked(deleteR2File).mockRejectedValue(new Error('R2 unavailable'));

    const response = await DELETE();

    expect(response.status).toBe(500);
    expect(deleteResume).not.toHaveBeenCalled();
  });

  it('does not delete an R2 key outside the current user path', async () => {
    vi.mocked(currentUser).mockResolvedValue({ id: 'user_123' } as never);
    vi.mocked(getResume).mockResolvedValue({
      status: 'draft',
      file: {
        name: 'resume.pdf',
        url: 'https://r2.example/resume.pdf',
        size: 100,
        bucket: 'resumes',
        key: 'uploads/another_user/resume.pdf',
      },
    });

    const response = await DELETE();

    expect(response.status).toBe(200);
    expect(deleteR2File).not.toHaveBeenCalled();
    expect(deleteResume).toHaveBeenCalledWith('user_123');
  });
});

describe('POST /api/resume', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('preserves server-owned file data during client updates', async () => {
    vi.mocked(currentUser).mockResolvedValue({ id: 'user_123' } as never);
    vi.mocked(getResume).mockResolvedValue({
      status: 'draft',
      fileContent: 'Trusted extracted text',
      file: {
        name: 'resume.pdf',
        url: 'https://r2.example/resume.pdf',
        size: 100,
        bucket: 'resumes',
        key: 'uploads/user_123/resume.pdf',
      },
    });

    const response = await POST(
      new Request('http://localhost/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'live',
          fileContent: 'Forged text',
          file: {
            name: 'other.pdf',
            url: 'https://r2.example/other.pdf',
            size: 100,
            bucket: 'resumes',
            key: 'uploads/another_user/resume.pdf',
          },
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(storeResume).toHaveBeenCalledWith('user_123', {
      status: 'live',
      fileContent: 'Trusted extracted text',
      file: {
        name: 'resume.pdf',
        url: 'https://r2.example/resume.pdf',
        size: 100,
        bucket: 'resumes',
        key: 'uploads/user_123/resume.pdf',
      },
    });
  });
});
