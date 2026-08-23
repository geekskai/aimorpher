import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import PreviewActionbar from '@/components/PreviewActionbar';

vi.mock('@/components/UsernameEditorView', () => ({
  default: () => null,
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe('PreviewActionbar', () => {
  it('renders a disabled publish control with recovery guidance', () => {
    const html = renderToStaticMarkup(
      <PreviewActionbar
        initialUsername="alex"
        status="draft"
        isPublishBlocked
      />,
    );

    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-describedby="publish-blocked-message"');
    expect(html).toContain('Save changes before publishing');
  });

  it('keeps publish available after changes are saved', () => {
    const html = renderToStaticMarkup(
      <PreviewActionbar initialUsername="alex" status="draft" />,
    );

    expect(html).toContain('>Publish<');
    expect(html).not.toContain('Save changes before publishing');
  });

  it('exposes copy and visit controls for a live profile', () => {
    const html = renderToStaticMarkup(
      <PreviewActionbar initialUsername="alex" status="live" />,
    );

    expect(html).toContain('aria-label="Copy published profile link"');
    expect(html).toContain('>Visit Site<');
    expect(html).toContain('>Unpublish<');
  });
});
