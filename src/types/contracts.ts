/**
 * Contract management types and interfaces
 */

import { Province } from './common';

// Core contract data structure
export interface Contract {
  // Identification
  id: string;
  name: string;
  description?: string;
  
  // Basic pay structure
  baseRate: number; // Base hourly rate ($/hr)
  shiftPremium: number; // Shift premium ($/hr)
  
  // Overtime rules
  overtimeRules: OvertimeRule[];
  
  // Allowances and benefits
  perDiem: number; // Daily per diem ($/day)
  travelRate?: number; // Travel rate ($/hr)
  
  // Location and jurisdiction
  province: Province;
  location?: string;
  
  // Contract metadata
  union?: string; // Union local information
  employer?: string; // Employer/contractor name
  effectiveDate?: string; // Contract effective date
  expiryDate?: string; // Contract expiry date
  
  // Additional terms
  notes?: string; // Additional contract notes
  
  // Timestamps
  createdAt: number;
  updatedAt: number;
}

// Overtime rule definition
export interface OvertimeRule {
  // Rule identification
  id: string;
  description: string; // Human-readable description
  
  // Trigger conditions
  trigger: OvertimeTrigger;
  
  // Rate multiplier
  multiplier: number; // e.g., 1.5 for time-and-a-half, 2.0 for double-time
  
  // Priority for rule application
  priority: number; // Lower numbers have higher priority
}

// Overtime trigger conditions
export interface OvertimeTrigger {
  // Time-based triggers
  dailyHours?: number; // Hours per day threshold
  weeklyHours?: number; // Hours per week threshold
  
  // Day-based triggers
  consecutiveDays?: number; // Consecutive days worked
  weekendWork?: boolean; // Weekend work trigger
  holidayWork?: boolean; // Holiday work trigger
  
  // Shift-based triggers
  nightShift?: boolean; // Night shift premium
  shiftLength?: number; // Minimum shift length for trigger
}

// Contract preset for quick setup
export interface ContractPreset {
  name: string;
  description: string;
  template: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>;
}

// Contract validation rules
export interface ContractValidationRules {
  name: { required: true; minLength: number; maxLength: number };
  baseRate: { required: true; min: number; max: number };
  shiftPremium: { min: number; max: number };
  perDiem: { min: number; max: number };
  travelRate: { min: number; max: number };
}

// Contract search and filter options
export interface ContractFilters {
  // Text search
  searchTerm?: string;
  
  // Location filters
  province?: Province;
  location?: string;
  
  // Organization filters
  union?: string;
  employer?: string;
  
  // Date filters
  effectiveAfter?: string;
  effectiveBefore?: string;
  
  // Rate filters
  minRate?: number;
  maxRate?: number;
}

// Contract sorting options
export type ContractSortField = 
  | 'name'
  | 'baseRate'
  | 'effectiveDate'
  | 'createdAt'
  | 'updatedAt';

export type ContractSortOrder = 'asc' | 'desc';

export interface ContractSort {
  field: ContractSortField;
  order: ContractSortOrder;
}

// Contract import/export format
export interface ContractExportData {
  version: string;
  exportDate: string;
  contracts: Contract[];
}

// Contract form data for editing
export interface ContractFormData {
  // Basic information
  name: string;
  description: string;
  
  // Pay structure
  baseRate: number;
  shiftPremium: number;
  perDiem: number;
  travelRate: number;
  
  // Location
  province: Province;
  location: string;
  
  // Organization
  union: string;
  employer: string;
  
  // Dates
  effectiveDate: string;
  expiryDate: string;
  
  // Overtime rules (simplified for form)
  overtimeRule: string; // Text description of OT rules
  
  // Notes
  notes: string;
}

// Contract application result
export interface ContractApplication {
  contract: Contract;
  appliedRates: {
    baseRate: number;
    shiftPremium: number;
    perDiem: number;
    travelRate?: number;
  };
  appliedRules: OvertimeRule[];
}

// Contract statistics
export interface ContractStats {
  totalContracts: number;
  averageBaseRate: number;
  rateRange: {
    min: number;
    max: number;
  };
  provinceDistribution: Record<Province, number>;
  recentlyUsed: Contract[];
}