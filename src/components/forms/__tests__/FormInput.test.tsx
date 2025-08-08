import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormInput } from '../FormInput';

describe('FormInput', () => {
  it('renders with label and input', () => {
    const handleChange = jest.fn();
    
    render(
      <FormInput
        label="Email Address"
        value="test@example.com"
        onChange={handleChange}
      />
    );

    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('shows required indicator', () => {
    render(
      <FormInput
        label="Required Field"
        value=""
        onChange={() => {}}
        required
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(
      <FormInput
        label="Email"
        value=""
        onChange={() => {}}
        error="Email is required"
      />
    );

    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('displays help text when no error', () => {
    render(
      <FormInput
        label="Password"
        value=""
        onChange={() => {}}
        helpText="Must be at least 8 characters"
      />
    );

    expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
  });

  it('calls onChange when input changes', () => {
    const handleChange = jest.fn();
    
    render(
      <FormInput
        label="Name"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText('Name');
    fireEvent.change(input, { target: { value: 'John Doe' } });
    
    expect(handleChange).toHaveBeenCalledWith('John Doe');
  });

  it('applies error styling to input when error is present', () => {
    render(
      <FormInput
        label="Email"
        value=""
        onChange={() => {}}
        error="Invalid email"
      />
    );

    const input = screen.getByLabelText('Email');
    expect(input).toHaveClass('border-red-500');
  });
});