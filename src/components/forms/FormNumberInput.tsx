import React from 'react';
import { Field, NumberInput } from '../ui';
import { NumberInputProps } from '../../types/ui';

/**
 * Props for FormNumberInput component
 */
export interface FormNumberInputProps extends Omit<NumberInputProps, 'id'> {
  label: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  fieldClassName?: string;
}

/**
 * FormNumberInput component that combines Field and NumberInput with validation
 */
export const FormNumberInput: React.FC<FormNumberInputProps> = ({
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
      <NumberInput {...inputProps} error={error} />
    </Field>
  );
};