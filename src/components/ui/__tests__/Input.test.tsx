import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';

describe('Input', () => {
  it('renders with value and calls onChange', () => {
    const handleChange = jest.fn();
    
    render(
      <Input
        value="test value"
        onChange={handleChange}
        placeholder="Enter text"
      />
    );

    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
    expect(input.value).toBe('test value');

    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledWith('new value');
  });

  it('applies error variant when error prop is provided', () => {
    render(
      <Input
        value=""
        onChange={() => {}}
        error="This field is required"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
  });

  it('applies success variant correctly', () => {
    render(
      <Input
        value=""
        onChange={() => {}}
        variant="success"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-green-500');
  });

  it('forwards additional props', () => {
    render(
      <Input
        value=""
        onChange={() => {}}
        data-testid="custom-input"
        disabled
      />
    );

    const input = screen.getByTestId('custom-input');
    expect(input).toBeDisabled();
  });
});