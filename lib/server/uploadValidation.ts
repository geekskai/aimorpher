import { MAX_PDF_SIZE_BYTES } from '@/lib/config';

export { MAX_PDF_SIZE_BYTES };

type UploadMetadata = {
  name: string;
  type: string;
  size: number;
};

type PdfUpload = UploadMetadata & {
  bytes: Uint8Array;
};

export type UploadValidationResult =
  | { valid: true }
  | { valid: false; error: string };

export function validatePdfUploadMetadata(
  upload: UploadMetadata,
): UploadValidationResult {
  if (
    upload.type.toLowerCase() !== 'application/pdf' ||
    !upload.name.toLowerCase().endsWith('.pdf')
  ) {
    return { valid: false, error: 'Only PDF files are supported' };
  }

  if (upload.size === 0) {
    return { valid: false, error: 'The PDF is empty' };
  }

  if (upload.size > MAX_PDF_SIZE_BYTES) {
    return {
      valid: false,
      error: 'PDF files must be 10 MB or smaller',
    };
  }

  return { valid: true };
}

export function validatePdfSignature(bytes: Uint8Array): UploadValidationResult {
  const pdfSignature = [0x25, 0x50, 0x44, 0x46, 0x2d];
  const hasPdfSignature = pdfSignature.every(
    (value, index) => bytes[index] === value,
  );

  return hasPdfSignature
    ? { valid: true }
    : { valid: false, error: 'The uploaded file is not a valid PDF' };
}

export function validatePdfUpload(upload: PdfUpload): UploadValidationResult {
  const metadataResult = validatePdfUploadMetadata(upload);
  return metadataResult.valid
    ? validatePdfSignature(upload.bytes)
    : metadataResult;
}
