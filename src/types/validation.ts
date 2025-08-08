/**
 * Form validation types and schemas
 */

// Generic validation rule interface
export interface ValidationRule<T = any> {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
  message?: string;
}

// Field validation schema
export interface FieldValidationSchema<T = any> {
  [fieldName: string]: ValidationRule<T>;
}

// Validation result for a single field
export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

// Validation result for entire form
export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings?: Record<string, string>;
}

// Validation context for complex validations
export interface ValidationContext {
  allValues: Record<string, any>;
  changedField?: string;
  validationMode: 'onChange' | 'onBlur' | 'onSubmit';
}

// Async validation function
export type AsyncValidator<T = any> = (
  value: T,
  context: ValidationContext
) => Promise<string | null>;

// Validation rule with async support
export interface AsyncValidationRule<T = any> extends ValidationRule<T> {
  asyncValidator?: AsyncValidator<T>;
}

// Enhanced field schema with async validation
export interface AsyncFieldValidationSchema<T = any> {
  [fieldName: string]: AsyncValidationRule<T>;
}

// Validation hook return type
export interface UseValidationReturn {
  validate: (fieldName: string, value: any) => FieldValidationResult;
  validateAll: (values: Record<string, any>) => FormValidationResult;
  validateAsync: (fieldName: string, value: any) => Promise<FieldValidationResult>;
  isValidating: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
  clearError: (fieldName: string) => void;
  clearAllErrors: () => void;
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-()]+$/,
  POSTAL_CODE_CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
  SIN: /^\d{3}[ -]?\d{3}[ -]?\d{3}$/,
  CURRENCY: /^\d+(\.\d{1,2})?$/,
  PERCENTAGE: /^\d+(\.\d{1,2})?$/,
  DATE_ISO: /^\d{4}-\d{2}-\d{2}$/,
  TIME_24H: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
} as const;

// Validation message templates
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  MIN_VALUE: 'Value must be at least {min}',
  MAX_VALUE: 'Value must be at most {max}',
  MIN_LENGTH: 'Must be at least {minLength} characters',
  MAX_LENGTH: 'Must be at most {maxLength} characters',
  PATTERN: 'Invalid format',
  EMAIL: 'Please enter a valid email address',
  PHONE: 'Please enter a valid phone number',
  POSTAL_CODE: 'Please enter a valid postal code',
  CURRENCY: 'Please enter a valid amount',
  PERCENTAGE: 'Please enter a valid percentage',
  DATE: 'Please enter a valid date',
  TIME: 'Please enter a valid time',
} as const;

// Validation rule builders
export const ValidationRules = {
  required: (message?: string): ValidationRule => ({
    required: true,
    message: message || VALIDATION_MESSAGES.REQUIRED,
  }),

  minValue: (min: number, message?: string): ValidationRule => ({
    min,
    message: message || VALIDATION_MESSAGES.MIN_VALUE.replace('{min}', min.toString()),
  }),

  maxValue: (max: number, message?: string): ValidationRule => ({
    max,
    message: message || VALIDATION_MESSAGES.MAX_VALUE.replace('{max}', max.toString()),
  }),

  range: (min: number, max: number, message?: string): ValidationRule => ({
    min,
    max,
    message: message || `Value must be between ${min} and ${max}`,
  }),

  minLength: (minLength: number, message?: string): ValidationRule => ({
    minLength,
    message: message || VALIDATION_MESSAGES.MIN_LENGTH.replace('{minLength}', minLength.toString()),
  }),

  maxLength: (maxLength: number, message?: string): ValidationRule => ({
    maxLength,
    message: message || VALIDATION_MESSAGES.MAX_LENGTH.replace('{maxLength}', maxLength.toString()),
  }),

  pattern: (pattern: RegExp, message?: string): ValidationRule => ({
    pattern,
    message: message || VALIDATION_MESSAGES.PATTERN,
  }),

  email: (message?: string): ValidationRule => ({
    pattern: VALIDATION_PATTERNS.EMAIL,
    message: message || VALIDATION_MESSAGES.EMAIL,
  }),

  currency: (message?: string): ValidationRule => ({
    pattern: VALIDATION_PATTERNS.CURRENCY,
    message: message || VALIDATION_MESSAGES.CURRENCY,
  }),

  percentage: (message?: string): ValidationRule => ({
    pattern: VALIDATION_PATTERNS.PERCENTAGE,
    message: message || VALIDATION_MESSAGES.PERCENTAGE,
  }),

  custom: <T>(validator: (value: T) => string | null, message?: string): ValidationRule<T> => ({
    custom: validator,
    message,
  }),
} as const;