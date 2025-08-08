import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PresetButton } from '../PresetButton';

describe('PresetButton', () => {
  it('renders with label and calls onApply', () => {
    const handleApply = jest.fn();
    
    render(
      <PresetButton
        label="Standard Rate"
        onApply={handleApply}
      />
    );

    const button = screen.getByRole('button', { name: 'Standard Rate' });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleApply).toHaveBeenCalledTimes(1);
  });

  it('renders with description', () => {
    render(
      <PresetButton
        label="Overtime Rate"
        description="1.5x base rate for overtime hours"
        onApply={() => {}}
      />
    );

    expect(screen.getByText('Overtime Rate')).toBeInTheDocument();
    expect(screen.getByText('1.5x base rate for overtime hours')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;
    
    render(
      <PresetButton
        label="Quick Setup"
        icon={<TestIcon />}
        onApply={() => {}}
      />
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('applies custom variant and size', () => {
    render(
      <PresetButton
        label="Delete Preset"
        variant="danger"
        size="lg"
        onApply={() => {}}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
    expect(button).toHaveClass('px-6', 'py-3');
  });

  it('can be disabled', () => {
    const handleApply = jest.fn();
    
    render(
      <PresetButton
        label="Disabled Preset"
        onApply={handleApply}
        disabled
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleApply).not.toHaveBeenCalled();
  });

  it('applies full width styling', () => {
    render(
      <PresetButton
        label="Full Width"
        onApply={() => {}}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full', 'justify-start');
  });
});