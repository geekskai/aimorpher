export type FileContentProblem =
  | 'empty'
  | 'too_short'
  | 'unreadable'
  | 'repetitive';

export type FileContentAssessment =
  | { valid: true }
  | { valid: false; reason: FileContentProblem };

const MIN_CONTENT_LENGTH = 80;
const MIN_READABLE_CHARACTERS = 40;

export function assessFileContent(fileContent: string): FileContentAssessment {
  const normalized = fileContent.normalize('NFKC').replace(/\s+/gu, ' ').trim();

  if (!normalized) return { valid: false, reason: 'empty' };
  if (normalized.length < MIN_CONTENT_LENGTH) {
    return { valid: false, reason: 'too_short' };
  }

  const readableCharacters = normalized.match(/[\p{L}\p{N}]/gu)?.length ?? 0;
  if (
    readableCharacters < MIN_READABLE_CHARACTERS ||
    readableCharacters / normalized.length < 0.25
  ) {
    return { valid: false, reason: 'unreadable' };
  }

  const tokens =
    normalized
      .toLocaleLowerCase()
      .match(/[\p{L}\p{N}][\p{L}\p{N}+#.-]*/gu) ?? [];
  if (tokens.length >= 20) {
    const uniqueTokenRatio = new Set(tokens).size / tokens.length;
    if (uniqueTokenRatio < 0.1) {
      return { valid: false, reason: 'repetitive' };
    }
  }

  return { valid: true };
}

export async function isFileContentBad(fileContent: string) {
  return !assessFileContent(fileContent).valid;
}
