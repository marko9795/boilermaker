import React from 'react';
import { render } from '@testing-library/react';
import { ScreenReaderOnly } from '../ScreenReaderOnly';

describe('ScreenReaderOnly', () => {
  it('renders with screen reader only classes', () => {
    const { container } = render(
      <ScreenReaderOnly>Screen reader content</ScreenReaderOnly>
    );

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('sr-only', 'absolute', 'w-px', 'h-px');
  });

  it('renders with custom element type', () => {
    const { container } = render(
      <ScreenReaderOnly as="div">Screen reader content</ScreenReaderOnly>
    );

    const element = container.firstChild as HTMLElement;
    expect(element.tagName.toLowerCase()).toBe('div');
  });

  it('forwards additional props', () => {
    const { container } = render(
      <ScreenReaderOnly data-testid="sr-only" id="test-id">
        Screen reader content
      </ScreenReaderOnly>
    );

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveAttribute('data-testid', 'sr-only');
    expect(element).toHaveAttribute('id', 'test-id');
  });

  it('applies custom className in addition to sr-only classes', () => {
    const { container } = render(
      <ScreenReaderOnly className="custom-class">
        Screen reader content
      </ScreenReaderOnly>
    );

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('sr-only', 'custom-class');
  });
});