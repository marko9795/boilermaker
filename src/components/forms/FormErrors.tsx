import React from 'react';
import { BaseComponentProps } from '../../types/ui';

/**
 * Props for individual form errors
 */
export interface FormError {
  field: string;
  message: string;
}

/**
 * Props for FormErrors component
 */
export interface FormErrorsProps extends BaseComponentProps {
  errors: FormError[];
  title?: string;
}

/**
 * FormErrors component for displaying form validation errors
 */
export const FormErrors: React.FC<FormErrorsProps> = ({
  errors,
  title = 'Please fix the following errors:',
  className = '',
}) => {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-lg border border-red-500/20 bg-red-900/10 p-4 ${className}`} role="alert">
      <div className="flex items-center gap-2 mb-2">
        <svg 
          className="h-5 w-5 text-red-400 flex-shrink-0" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
        <h3 className="text-sm font-medium text-red-400">{title}</h3>
      </div>
      
      <ul className="space-y-1">
        {errors.map((error, index) => (
          <li key={`${error.field}-${index}`} className="text-sm text-red-300">
            <span className="font-medium">{error.field}:</span> {error.message}
          </li>
        ))}
      </ul>
    </div>
  );
};