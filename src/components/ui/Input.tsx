import React from 'react';
import { InputProps } from '../../types/ui';

/**
 * Input component for text input fields
 */
export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  error,
  variant = 'default',
  className = '',
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
    onChange(e.target.value);
  };

  return (
    <input
      {...props}
      value={value}
      onChange={handleChange}
      className={inputClasses}
      aria-invalid={error ? 'true' : 'false'}
    />
  );
};