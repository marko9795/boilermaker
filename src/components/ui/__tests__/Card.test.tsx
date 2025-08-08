import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('renders with title and children', () => {
    render(
      <Card title="Test Card">
        <p>Card content</p>
      </Card>
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;
    
    render(
      <Card title="Test Card" icon={<TestIcon />}>
        <p>Card content</p>
      </Card>
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { container } = render(
      <Card title="Test Card" variant="outlined">
        <p>Card content</p>
      </Card>
    );

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('border-neutral-700', 'bg-transparent');
  });

  it('applies size classes correctly', () => {
    const { container } = render(
      <Card title="Test Card" size="lg">
        <p>Card content</p>
      </Card>
    );

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('p-6');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Card title="Test Card" className="custom-class">
        <p>Card content</p>
      </Card>
    );

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveClass('custom-class');
  });
});