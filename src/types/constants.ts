/**
 * Application constants and configuration types
 */

import { Province, PayFrequency, HitchType } from './common';
import { TaxConstants } from './payroll';
import { RiggingConstants } from './rigging';

// Application configuration
export interface AppConfig {
  // Application metadata
  name: string;
  version: string;
  description: string;
  
  // Feature flags
  features: {
    payrollCalculator: boolean;
    riggingCalculator: boolean;
    contractManagement: boolean;
    scenarioSaving: boolean;
    dataExport: boolean;
    advancedTax: boolean;
  };
  
  // Storage configuration
  storage: {
    maxScenarios: number;
    maxContracts: number;
    storagePrefix: string;
    enableCompression: boolean;
  };
  
  // UI configuration
  ui: {
    theme: 'light' | 'dark' | 'auto';
    defaultCurrency: string;
    dateFormat: string;
    numberFormat: string;
    decimalPlaces: number;
  };
  
  // Calculation configuration
  calculations: {
    taxYear: number;
    defaultProvince: Province;
    defaultPayFrequency: PayFrequency;
    roundingPrecision: number;
  };
}

// Default application configuration
export const DEFAULT_APP_CONFIG: AppConfig = {
  name: 'Boilermaker Toolbox',
  version: '2.0.0',
  description: 'Professional payroll and rigging calculations for union boilermakers',
  
  features: {
    payrollCalculator: true,
    riggingCalculator: true,
    contractManagement: true,
    scenarioSaving: true,
    dataExport: true,
    advancedTax: true,
  },
  
  storage: {
    maxScenarios: 100,
    maxContracts: 50,
    storagePrefix: 'bmt_',
    enableCompression: false,
  },
  
  ui: {
    theme: 'dark',
    defaultCurrency: 'CAD',
    dateFormat: 'YYYY-MM-DD',
    numberFormat: 'en-CA',
    decimalPlaces: 2,
  },
  
  calculations: {
    taxYear: 2025,
    defaultProvince: 'AB',
    defaultPayFrequency: 'weekly',
    roundingPrecision: 2,
  },
};

// Tax calculation constants for 2025
export const TAX_CONSTANTS_2025: TaxConstants = {
  // CPP constants
  YMPE: 71300, // Year's Maximum Pensionable Earnings
  YAMPE: 81200, // Year's Additional Maximum Pensionable Earnings
  CPP_RATE: 0.0595, // CPP1 employee rate
  CPP2_RATE: 0.04, // CPP2 employee rate
  CPP_BASIC_EXEMPTION: 3500, // CPP basic exemption
  
  // EI constants
  EI_MIE: 65700, // Maximum Insurable Earnings
  EI_RATE: 0.0164, // EI employee rate
  
  // Federal tax brackets and rates
  FEDERAL_BRACKETS: [57375, 114750, 177882, 253414],
  FEDERAL_RATES_JAN: [0.15, 0.205, 0.26, 0.29, 0.33],
  FEDERAL_RATES_JUL: [0.14, 0.205, 0.26, 0.29, 0.33],
  
  // Provincial tax brackets and rates (Alberta)
  AB_BRACKETS: [60000, 151234, 181481, 241974, 362961],
  AB_RATES_JAN: [0.10, 0.10, 0.12, 0.13, 0.14, 0.15],
  AB_RATES_JUL: [0.06, 0.10, 0.12, 0.13, 0.14, 0.15],
  
  // Tax credits
  FEDERAL_BPA_MAX: 16129, // Federal Basic Personal Amount (maximum)
  FEDERAL_BPA_MIN: 14538, // Federal Basic Personal Amount (minimum)
  FEDERAL_BPA_THRESHOLD_LOW: 177882, // Income threshold for max BPA
  FEDERAL_BPA_THRESHOLD_HIGH: 253414, // Income threshold for min BPA
  CANADA_EMPLOYMENT_AMOUNT: 1471, // Canada Employment Amount
  AB_BPA: 22323, // Alberta Basic Personal Amount
};

// Rigging calculation constants
export const RIGGING_CONSTANTS: RiggingConstants = {
  // Physical constants
  GRAVITY: 9.80665, // Gravitational acceleration (m/s²)
  
  // Safety factors
  DESIGN_FACTOR: 1.25, // Design safety factor for WLL selection
  MINIMUM_SAFETY_MARGIN: 25, // Minimum acceptable safety margin (%)
  
  // Geometric limits
  MIN_ANGLE: 10, // Minimum safe included angle (degrees)
  MAX_ANGLE: 150, // Maximum practical included angle (degrees)
  MAX_LEGS: 4, // Maximum number of sling legs
  
  // Hitch factors
  HITCH_FACTORS: {
    vertical: 1.0,
    choker: 0.75,
    basket: 2.0,
  },
};

// Pay frequency configuration
export const PAY_FREQUENCY_CONFIG: Record<PayFrequency, { periods: number; label: string }> = {
  weekly: { periods: 52, label: 'Weekly (52)' },
  biweekly: { periods: 26, label: 'Biweekly (26)' },
  semimonthly: { periods: 24, label: 'Semi-monthly (24)' },
  monthly: { periods: 12, label: 'Monthly (12)' },
};

// Province configuration
export const PROVINCE_CONFIG: Record<Province, { name: string; taxSupported: boolean }> = {
  AB: { name: 'Alberta', taxSupported: true },
  BC: { name: 'British Columbia', taxSupported: false },
  MB: { name: 'Manitoba', taxSupported: false },
  NB: { name: 'New Brunswick', taxSupported: false },
  NL: { name: 'Newfoundland & Labrador', taxSupported: false },
  NS: { name: 'Nova Scotia', taxSupported: false },
  NT: { name: 'Northwest Territories', taxSupported: false },
  NU: { name: 'Nunavut', taxSupported: false },
  ON: { name: 'Ontario', taxSupported: false },
  PE: { name: 'Prince Edward Island', taxSupported: false },
  QC: { name: 'Quebec', taxSupported: false },
  SK: { name: 'Saskatchewan', taxSupported: false },
  YT: { name: 'Yukon', taxSupported: false },
};

// Hitch type configuration
export const HITCH_TYPE_CONFIG: Record<HitchType, { label: string; factor: number; description: string }> = {
  vertical: {
    label: 'Vertical',
    factor: 1.0,
    description: 'Straight vertical lift with sling legs perpendicular to load',
  },
  choker: {
    label: 'Choker',
    factor: 0.75,
    description: 'Sling wrapped around load with reduced capacity',
  },
  basket: {
    label: 'Basket',
    factor: 2.0,
    description: 'Sling forms cradle under load with doubled capacity',
  },
};

// Local storage keys
export const STORAGE_KEYS = {
  SCENARIOS: 'bmt_scenarios',
  CONTRACTS: 'bmt_contracts',
  USER_PREFERENCES: 'bmt_preferences',
  APP_CONFIG: 'bmt_config',
  LAST_PAYROLL_INPUTS: 'bmt_last_payroll',
  LAST_RIGGING_INPUTS: 'bmt_last_rigging',
} as const;

// API endpoints (for future use)
export const API_ENDPOINTS = {
  TAX_RATES: '/api/tax-rates',
  EXCHANGE_RATES: '/api/exchange-rates',
  SLING_DATABASE: '/api/slings',
  USER_PROFILE: '/api/user',
  SCENARIOS: '/api/scenarios',
  CONTRACTS: '/api/contracts',
} as const;

// Error codes
export const ERROR_CODES = {
  // Validation errors
  INVALID_INPUT: 'INVALID_INPUT',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  OUT_OF_RANGE: 'OUT_OF_RANGE',
  
  // Calculation errors
  CALCULATION_FAILED: 'CALCULATION_FAILED',
  DIVISION_BY_ZERO: 'DIVISION_BY_ZERO',
  INVALID_CONFIGURATION: 'INVALID_CONFIGURATION',
  
  // Storage errors
  STORAGE_FULL: 'STORAGE_FULL',
  STORAGE_UNAVAILABLE: 'STORAGE_UNAVAILABLE',
  SERIALIZATION_ERROR: 'SERIALIZATION_ERROR',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  
  // General errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  FEATURE_DISABLED: 'FEATURE_DISABLED',
} as const;

// Default form values
export const DEFAULT_PAYROLL_INPUTS = {
  rate: 60,
  straightTime: 40,
  overtimeHalf: 0,
  overtimeDouble: 0,
  shiftPremium: 0,
  travelHours: 0,
  travelRate: 0,
  perDiem: 0,
  days: 5,
  payDate: new Date().toISOString().slice(0, 10),
  frequency: 'weekly' as PayFrequency,
  province: 'AB' as Province,
};

export const DEFAULT_DEDUCTION_INPUTS = {
  unionDuesPercent: 3.0,
  rrspPercent: 0,
  rrspAtSource: true,
  otherDeductions: 0,
};

export const DEFAULT_YTD_INPUTS = {
  pensionableEarnings: 0,
  cpp1Paid: 0,
  cpp2Paid: 0,
  insurableEarnings: 0,
  eiPaid: 0,
};

export const DEFAULT_RIGGING_INPUTS = {
  hitchType: 'vertical' as HitchType,
  weight: 5000,
  legs: 2,
  angle: 60,
  cogOffset: 0,
  spacing: 2000,
  slingWLL: 4000,
};