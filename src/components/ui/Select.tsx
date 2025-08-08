import React from 'react';
import { SelectProps } from '../../types/ui';

/**
 * Select component for dropdown selection
 */
export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  error,
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 appearance-none bg-no-repeat bg-right bg-[length:16px_16px] pr-8';
  
  const variantClasses = {
    default: 'border-neutral-700 bg-neutral-800 text-white focus:border-blue-500 focus:ring-blue-500/20',
    error: 'border-red-500 bg-neutral-800 text-white focus:border-red-500 focus:ring-red-500/20',
    success: 'border-green-500 bg-neutral-800 text-white focus:border-green-500 focus:ring-green-500/20',
  };

  const selectVariant = error ? 'error' : variant;
  const selectClasses = `${baseClasses} ${variantClasses[selectVariant]} ${className}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  // SVG chevron down icon as background image
  const chevronIcon = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`;

  return (
    <div className="relative">
      <select
        {...props}
        value={value}
        onChange={handleChange}
        className={selectClasses}
        style={{
          backgroundImage: chevronIcon,
        }}
        aria-invalid={error ? 'true' : 'false'}
      >
        {children}
      </select>
    </div>
  );
};