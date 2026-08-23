export type ProfilePublishStatus = 'draft' | 'live' | undefined;

export function isProfilePublishBlocked(
  status: ProfilePublishStatus,
  hasUnsavedChanges: boolean,
  isSaving: boolean,
) {
  return status === 'draft' && (hasUnsavedChanges || isSaving);
}

export function getSaveErrorMessage(error: unknown) {
  return error instanceof Error
    ? `Failed to save changes: ${error.message}`
    : 'Failed to save changes';
}
