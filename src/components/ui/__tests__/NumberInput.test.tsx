import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NumberInput } from '../NumberInput';

describe('NumberInput', () => {
  it('renders with numeric value and calls onChange', () => {
    const handleChange = jest.fn();
    
    render(
      <NumberInput
        value={42}
        onChange={handleChange}
        placeholder="Enter number"
      />
    );

    const input = screen.getByPlaceholderText('Enter number') as HTMLInputElement;
    expect(input.value).toBe('42');

    fireEvent.change(input, { target: { value: '100' } });
    expect(handleChange).toHaveBeenCalledWith(100);
  });

  it('handles empty input by setting value to 0', () => {
    const handleChange = jest.fn();
    
    render(
      <NumberInput
        value={42}
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '' } });
    expect(handleChange).toHaveBeenCalledWith(0);
  });

  it('applies min constraint', () => {
    const handleChange = jest.fn();
    
    render(
      <NumberInput
        value={10}
        onChange={handleChange}
        min={5}
      />
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '3' } });
    expect(handleChange).toHaveBeenCalledWith(5);
  });

  it('applies max constraint', () => {
    const handleChange = jest.fn();
    
    render(
      <NumberInput
        value={10}
        onChange={handleChange}
        max={50}
      />
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '100' } });
    expect(handleChange).toHaveBeenCalledWith(50);
  });

  it('handles invalid input by converting to 0', () => {
    const handleChange = jest.fn();
    
    render(
      <NumberInput
        value={10}
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('spinbutton');
    
    // Clear any previous calls
    handleChange.mockClear();
    
    fireEvent.change(input, { target: { value: '' } });
    // Empty input should convert to 0
    expect(handleChange).toHaveBeenCalledWith(0);
  });

  it('resets to 0 on blur with invalid value', () => {
    const handleChange = jest.fn();
    
    render(
      <NumberInput
        value={10}
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    input.value = 'invalid';
    fireEvent.blur(input);
    expect(handleChange).toHaveBeenCalledWith(0);
  });
});