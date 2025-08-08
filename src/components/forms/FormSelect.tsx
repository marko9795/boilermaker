import React from 'react';
import { Field, Select } from '../ui';
import { SelectProps } from '../../types/ui';

/**
 * Props for FormSelect component
 */
export interface FormSelectProps extends Omit<SelectProps, 'id'> {
  label: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  fieldClassName?: string;
}

/**
 * FormSelect component that combines Field and Select with validation
 */
export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  error,
  required = false,
  helpText,
  fieldClassName,
  children,
  ...selectProps
}) => {
  return (
    <Field
      label={label}
      error={error}
      required={required}
      helpText={helpText}
      className={fieldClassName}
    >
      <Select {...selectProps} error={error}>
        {children}
      </Select>
    </Field>
  );
};