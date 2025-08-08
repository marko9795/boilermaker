/**
 * UI Components Library
 * 
 * This module exports all reusable UI components for the Boilermaker Toolbox application.
 * Components are organized by functionality and follow consistent design patterns.
 */

// Basic UI primitives
export { Card } from './Card';
export { Field } from './Field';
export { Input } from './Input';
export { NumberInput } from './NumberInput';
export { Select } from './Select';
export { Button } from './Button';
export { KPI } from './KPI';
export { Separator } from './Separator';
export { Breakdown } from './Breakdown';

// Accessibility components
export { ScreenReaderOnly } from './ScreenReaderOnly';
export { LiveRegion } from './LiveRegion';
export { FocusTrap } from './FocusTrap';

// Re-export types for convenience
export type {
  CardProps,
  FieldProps,
  InputProps,
  NumberInputProps,
  SelectProps,
  ButtonProps,
  KPIProps,
  SeparatorProps,
} from '../../types/ui';

export type {
  BreakdownProps,
  BreakdownItemProps,
} from './Breakdown';

export type {
  ScreenReaderOnlyProps,
} from './ScreenReaderOnly';

export type {
  LiveRegionProps,
} from './LiveRegion';

export type {
  FocusTrapProps,
} from './FocusTrap';