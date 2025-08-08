/**
 * Main types export file
 * Exports all type definitions for easy importing throughout the application
 */

// Common types
export * from './common';

// Payroll types
export * from './payroll';

// Rigging types
export * from './rigging';

// Contract types
export * from './contracts';

// Scenario types
export * from './scenarios';

// UI component types
export * from './ui';

// Error handling types
export * from './errors';

// Validation types
export * from './validation';

// Constants and configuration types
export * from './constants';

// Re-export React types for convenience
export type { 
  ReactNode, 
  ReactElement, 
  ComponentType, 
  FC, 
  PropsWithChildren,
  HTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  ButtonHTMLAttributes,
  FormHTMLAttributes
} from 'react';