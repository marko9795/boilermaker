import React from 'react';
import { Field, Input } from '../ui';
import { InputProps } from '../../types/ui';

/**
 * Props for FormInput component
 */
export interface FormInputProps extends Omit<InputProps, 'id'> {
  label: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  fieldClassName?: string;
}

/**
 * FormInput component that combines Field and Input with validation
 */
export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  required = false,
  helpText,
  fieldClassName,
  ...inputProps
}) => {
  return (
    <Field
      label={label}
      error={error}
      required={required}
      helpText={helpText}
      className={fieldClassName}
    >
      <Input {...inputProps} error={error} />
    </Field>
  );
};