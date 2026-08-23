import { describe, expect, it } from 'vitest';
import {
  getSaveErrorMessage,
  isProfilePublishBlocked,
} from '@/lib/profileEditorRules';

describe('profile editor interaction rules', () => {
  it('blocks publishing a draft while changes are unsaved or saving', () => {
    expect(isProfilePublishBlocked('draft', true, false)).toBe(true);
    expect(isProfilePublishBlocked('draft', false, true)).toBe(true);
    expect(isProfilePublishBlocked('draft', false, false)).toBe(false);
  });

  it('does not block unpublishing a live profile', () => {
    expect(isProfilePublishBlocked('live', true, true)).toBe(false);
  });

  it('keeps a useful message when saving fails', () => {
    expect(getSaveErrorMessage(new Error('Network unavailable'))).toBe(
      'Failed to save changes: Network unavailable',
    );
    expect(getSaveErrorMessage('unknown')).toBe('Failed to save changes');
  });
});
