/**
 * Payroll calculation types and interfaces
 */

import { Province, PayFrequency, BaseScenario } from './common';

// Core payroll input data
export interface PayrollInputs {
  // Basic pay information
  rate: number; // Base hourly rate ($/hr)
  straightTime: number; // Regular hours
  overtimeHalf: number; // Time-and-a-half hours
  overtimeDouble: number; // Double-time hours
  shiftPremium: number; // Shift premium ($/hr)
  
  // Travel and allowances
  travelHours: number; // Travel hours
  travelRate: number; // Travel rate ($/hr)
  perDiem: number; // Per diem amount ($/day)
  days: number; // Number of days for per diem
  
  // Pay period context
  payDate: string; // Pay date (YYYY-MM-DD format)
  frequency: PayFrequency; // Pay frequency
  province: Province; // Province for tax calculations
}

// Deduction-related inputs
export interface DeductionInputs {
  // Percentage-based deductions
  unionDuesPercent: number; // Union dues as percentage of gross wage
  rrspPercent: number; // RRSP contribution as percentage of gross wage
  
  // RRSP tax treatment
  rrspAtSource: boolean; // Whether RRSP reduces taxable income at source
  
  // Fixed deductions
  otherDeductions: number; // Other fixed deductions ($)
}

// Year-to-date inputs for statutory calculations
export interface YTDInputs {
  // CPP tracking
  pensionableEarnings: number; // YTD pensionable earnings for CPP
  cpp1Paid: number; // YTD CPP1 contributions paid
  cpp2Paid: number; // YTD CPP2 contributions paid
  
  // EI tracking
  insurableEarnings: number; // YTD insurable earnings for EI
  eiPaid: number; // YTD EI premiums paid
}

// Gross pay breakdown
export interface GrossPayBreakdown {
  // Wage components
  straightTimePay: number; // Regular time pay
  overtimeHalfPay: number; // Time-and-a-half pay
  overtimeDoublePay: number; // Double-time pay
  shiftPremiumPay: number; // Total shift premium
  travelPay: number; // Travel pay
  
  // Totals
  wage: number; // Total wage (taxable)
  allowances: number; // Non-taxable allowances (per diem)
  total: number; // Total gross (wage + allowances)
}

// CPP calculation results
export interface CPPResult {
  cpp1: number; // CPP1 contribution amount
  cpp2: number; // CPP2 contribution amount
  pensionableEarnings: number; // Pensionable earnings this pay
  cpp2Base: number; // CPP2 base earnings this pay
}

// EI calculation results
export interface EIResult {
  ei: number; // EI premium amount
  insurableEarnings: number; // Insurable earnings this pay
}

// Income tax calculation results
export interface TaxResult {
  federal: number; // Federal income tax
  provincial: number; // Provincial income tax
  taxableIncome: number; // Taxable income this pay
  annualizedIncome: number; // Annualized taxable income
}

// Complete deduction breakdown
export interface DeductionBreakdown {
  // Voluntary deductions
  union: number; // Union dues
  rrsp: number; // RRSP contribution
  other: number; // Other deductions
  
  // Statutory deductions
  cpp1: number; // CPP1 contribution
  cpp2: number; // CPP2 contribution
  ei: number; // EI premium
  federal: number; // Federal income tax
  provincial: number; // Provincial income tax
  
  // Total
  total: number; // Total deductions
}

// Complete payroll calculation results
export interface PayrollResults {
  gross: GrossPayBreakdown;
  deductions: DeductionBreakdown;
  net: number; // Net pay amount
}

// Tax calculation constants for 2025
export interface TaxConstants {
  // CPP constants
  YMPE: number; // Year's Maximum Pensionable Earnings
  YAMPE: number; // Year's Additional Maximum Pensionable Earnings
  CPP_RATE: number; // CPP1 employee rate
  CPP2_RATE: number; // CPP2 employee rate
  CPP_BASIC_EXEMPTION: number; // CPP basic exemption
  
  // EI constants
  EI_MIE: number; // Maximum Insurable Earnings
  EI_RATE: number; // EI employee rate
  
  // Federal tax brackets and rates
  FEDERAL_BRACKETS: number[]; // Federal tax bracket thresholds
  FEDERAL_RATES_JAN: number[]; // Federal rates January-June
  FEDERAL_RATES_JUL: number[]; // Federal rates July-December
  
  // Provincial tax brackets and rates (Alberta)
  AB_BRACKETS: number[]; // Alberta tax bracket thresholds
  AB_RATES_JAN: number[]; // Alberta rates January-June
  AB_RATES_JUL: number[]; // Alberta rates July-December
  
  // Tax credits
  FEDERAL_BPA_MAX: number; // Federal Basic Personal Amount (maximum)
  FEDERAL_BPA_MIN: number; // Federal Basic Personal Amount (minimum)
  FEDERAL_BPA_THRESHOLD_LOW: number; // Income threshold for max BPA
  FEDERAL_BPA_THRESHOLD_HIGH: number; // Income threshold for min BPA
  CANADA_EMPLOYMENT_AMOUNT: number; // Canada Employment Amount
  AB_BPA: number; // Alberta Basic Personal Amount
}

// Payroll scenario for saving/loading
export interface PayrollScenario extends BaseScenario {
  type: 'netpay';
  inputs: {
    payroll: PayrollInputs;
    deductions: DeductionInputs;
    ytd: YTDInputs;
  };
  results: PayrollResults;
}

// Payroll preset configuration
export interface PayrollPreset {
  name: string;
  description?: string;
  inputs: Partial<PayrollInputs>;
}

// Form validation schemas
export interface PayrollValidationRules {
  rate: { min: number; max: number; required: true };
  straightTime: { min: number; max: number };
  overtimeHalf: { min: number; max: number };
  overtimeDouble: { min: number; max: number };
  shiftPremium: { min: number; max: number };
  travelHours: { min: number; max: number };
  travelRate: { min: number; max: number };
  perDiem: { min: number; max: number };
  days: { min: number; max: number };
  unionDuesPercent: { min: number; max: number };
  rrspPercent: { min: number; max: number };
  otherDeductions: { min: number; max: number };
}