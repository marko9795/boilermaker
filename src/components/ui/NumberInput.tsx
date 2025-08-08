import React from 'react';
import { NumberInputProps } from '../../types/ui';

/**
 * NumberInput component for numeric input fields
 */
export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  error,
  variant = 'default',
  className = '',
  min,
  max,
  step = 0.01,
  ...props
}) => {
  const baseClasses = 'w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950';
  
  const variantClasses = {
    default: 'border-neutral-700 bg-neutral-800 text-white placeholder-neutral-400 focus:border-blue-500 focus:ring-blue-500/20',
    error: 'border-red-500 bg-neutral-800 text-white placeholder-neutral-400 focus:border-red-500 focus:ring-red-500/20',
    success: 'border-green-500 bg-neutral-800 text-white placeholder-neutral-400 focus:border-green-500 focus:ring-green-500/20',
  };

  const inputVariant = error ? 'error' : variant;
  const inputClasses = `${baseClasses} ${variantClasses[inputVariant]} ${className}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty string for clearing the field
    if (inputValue === '') {
      onChange(0);
      return;
    }

    // Parse the number and validate
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue)) {
      // Apply min/max constraints if provided
      let constrainedValue = numericValue;
      if (min !== undefined && typeof min === 'number' && constrainedValue < min) {
        constrainedValue = min;
      }
      if (max !== undefined && typeof max === 'number' && constrainedValue > max) {
        constrainedValue = max;
      }
      onChange(constrainedValue);
    }
    // Don't call onChange for invalid input - let the user continue typing
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Ensure the displayed value matches the actual value on blur
    const numericValue = parseFloat(e.target.value);
    if (isNaN(numericValue)) {
      onChange(0);
    }
    props.onBlur?.(e);
  };

  return (
    <input
      {...props}
      type="number"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      min={min}
      max={max}
      step={step}
      className={inputClasses}
      aria-invalid={error ? 'true' : 'false'}
    />
  );
};