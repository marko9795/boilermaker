/**
 * Common types and enums used across the application
 */

// Canadian provinces and territories
export type Province = 
  | 'AB' // Alberta
  | 'BC' // British Columbia
  | 'MB' // Manitoba
  | 'NB' // New Brunswick
  | 'NL' // Newfoundland & Labrador
  | 'NS' // Nova Scotia
  | 'NT' // Northwest Territories
  | 'NU' // Nunavut
  | 'ON' // Ontario
  | 'PE' // Prince Edward Island
  | 'QC' // Quebec
  | 'SK' // Saskatchewan
  | 'YT'; // Yukon

// Pay frequency options
export type PayFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';

// Rigging hitch types
export type HitchType = 'vertical' | 'choker' | 'basket';

// Application tab navigation
export type AppTab = 'netpay' | 'rigging' | 'contracts' | 'scenarios' | 'settings';

// Scenario types for saved calculations
export type ScenarioType = 'netpay' | 'rigging';

// Base interface for all saved scenarios
export interface BaseScenario {
  type: ScenarioType;
  name: string;
  ts: number; // timestamp
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Individual validation error
export interface ValidationError {
  field: string;
  message: string;
}

// Generic form field props
export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
}

// Number input constraints
export interface NumberInputConstraints {
  min?: number;
  max?: number;
  step?: number;
}