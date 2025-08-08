import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with children and calls onClick', () => {
    const handleClick = jest.fn();
    
    render(
      <Button onClick={handleClick}>
        Click me
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with icon', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;
    
    render(
      <Button icon={<TestIcon />}>
        Button with icon
      </Button>
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('Button with icon')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    const handleClick = jest.fn();
    
    render(
      <Button onClick={handleClick} loading>
        Submit
      </Button>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies variant classes correctly', () => {
    render(
      <Button variant="danger">
        Delete
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
  });

  it('applies size classes correctly', () => {
    render(
      <Button size="lg">
        Large button
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-base');
  });

  it('handles disabled state', () => {
    const handleClick = jest.fn();
    
    render(
      <Button onClick={handleClick} disabled>
        Disabled button
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});