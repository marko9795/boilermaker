import React from 'react';
import { FieldProps } from '../../types/ui';

/**
 * Field component for form field labels and error handling
 */
export const Field: React.FC<FieldProps> = ({
  label,
  error,
  required = false,
  helpText,
  htmlFor,
  children,
  className = '',
}) => {
  const fieldId = htmlFor || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`space-y-1 ${className}`}>
      <label 
        htmlFor={fieldId}
        className="block text-sm font-medium text-neutral-200"
      >
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      
      <div className="relative">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              id: fieldId,
              'aria-describedby': error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined,
              'aria-invalid': error ? 'true' : 'false',
              ...child.props,
            });
          }
          return child;
        })}
      </div>

      {helpText && !error && (
        <p id={`${fieldId}-help`} className="text-xs text-neutral-400">
          {helpText}
        </p>
      )}

      {error && (
        <p 
          id={`${fieldId}-error`} 
          className="text-xs text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};