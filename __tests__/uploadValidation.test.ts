import { describe, expect, it } from 'vitest';
import {
  MAX_PDF_SIZE_BYTES,
  validatePdfUpload,
} from '@/lib/server/uploadValidation';

const validPdfHeader = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]);

describe('validatePdfUpload', () => {
  it('accepts a PDF within the upload limit', () => {
    expect(
      validatePdfUpload({
        name: 'resume.pdf',
        type: 'application/pdf',
        size: validPdfHeader.length,
        bytes: validPdfHeader,
      }),
    ).toEqual({ valid: true });
  });

  it.each([
    {
      name: 'resume.txt',
      type: 'application/pdf',
      size: validPdfHeader.length,
      bytes: validPdfHeader,
      error: 'Only PDF files are supported',
    },
    {
      name: 'resume.pdf',
      type: 'text/plain',
      size: validPdfHeader.length,
      bytes: validPdfHeader,
      error: 'Only PDF files are supported',
    },
    {
      name: 'resume.pdf',
      type: 'application/pdf',
      size: 0,
      bytes: new Uint8Array(),
      error: 'The PDF is empty',
    },
    {
      name: 'resume.pdf',
      type: 'application/pdf',
      size: MAX_PDF_SIZE_BYTES + 1,
      bytes: validPdfHeader,
      error: 'PDF files must be 10 MB or smaller',
    },
    {
      name: 'resume.pdf',
      type: 'application/pdf',
      size: 5,
      bytes: new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f]),
      error: 'The uploaded file is not a valid PDF',
    },
  ])('rejects invalid uploads: $error', (upload) => {
    expect(validatePdfUpload(upload)).toEqual({
      valid: false,
      error: upload.error,
    });
  });
});
