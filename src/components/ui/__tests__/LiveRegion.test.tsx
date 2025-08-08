import React from 'react';
import { render } from '@testing-library/react';
import { LiveRegion } from '../LiveRegion';

describe('LiveRegion', () => {
  it('renders with default aria attributes', () => {
    const { container } = render(
      <LiveRegion>Status update</LiveRegion>
    );

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveAttribute('aria-live', 'polite');
    expect(element).toHaveAttribute('aria-atomic', 'false');
    expect(element).toHaveAttribute('aria-relevant', 'additions text');
    expect(element).toHaveAttribute('role', 'status');
  });

  it('renders with custom politeness level', () => {
    const { container } = render(
      <LiveRegion politeness="assertive">Urgent update</LiveRegion>
    );

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveAttribute('aria-live', 'assertive');
  });

  it('renders with atomic updates', () => {
    const { container } = render(
      <LiveRegion atomic>Complete update</LiveRegion>
    );

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveAttribute('aria-atomic', 'true');
  });

  it('renders with custom relevant attribute', () => {
    const { container } = render(
      <LiveRegion relevant="all">All changes</LiveRegion>
    );

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveAttribute('aria-relevant', 'all');
  });

  it('has screen reader only styling', () => {
    const { container } = render(
      <LiveRegion>Status update</LiveRegion>
    );

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('sr-only');
  });

  it('forwards additional props', () => {
    const { container } = render(
      <LiveRegion data-testid="live-region" id="status">
        Status update
      </LiveRegion>
    );

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveAttribute('data-testid', 'live-region');
    expect(element).toHaveAttribute('id', 'status');
  });
});