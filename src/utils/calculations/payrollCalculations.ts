/**
 * Payroll calculation orchestration functions
 * Coordinates gross pay, deductions, and net pay calculations
 */

import { PayFrequency, Province } from '../../types/common';
import {
  PayrollInputs,
  DeductionInputs,
  YTDInputs,
  GrossPayBreakdown,
  DeductionBreakdown,
  PayrollResults
} from '../../types/payroll';
import { PAY_FREQUENCY_CONFIG } from '../../types/constants';
import { calculateStatutoryDeductions } from './taxCalculations';

/**
 * Utility function to round to 2 decimal places
 */
const round2 = (value: number): number => Math.round(value * 100) / 100;

/**
 * Calculate gross pay breakdown from payroll inputs
 * @param inputs - Payroll input parameters
 * @returns Gross pay breakdown with all components
 */
export const calculateGrossPay = (inputs: PayrollInputs): GrossPayBreakdown => {
  const {
    rate,
    straightTime,
    overtimeHalf,
    overtimeDouble,
    shiftPremium,
    travelHours,
    travelRate,
    perDiem,
    days
  } = inputs;

  // Calculate wage components
  const straightTimePay = round2(straightTime * (rate + shiftPremium));
  const overtimeHalfPay = round2(overtimeHalf * (rate * 1.5 + shiftPremium));
  const overtimeDoublePay = round2(overtimeDouble * (rate * 2.0 + shiftPremium));
  const shiftPremiumPay = round2((straightTime + overtimeHalf + overtimeDouble) * shiftPremium);
  const travelPay = round2(travelHours * travelRate);

  // Calculate allowances (typically non-taxable)
  const allowances = round2(perDiem * days);

  // Calculate totals
  const wage = round2(straightTimePay + overtimeHalfPay + overtimeDoublePay + travelPay);
  const total = round2(wage + allowances);

  return {
    straightTimePay,
    overtimeHalfPay,
    overtimeDoublePay,
    shiftPremiumPay,
    travelPay,
    wage,
    allowances,
    total
  };
};

/**
 * Calculate voluntary deductions (union dues, RRSP, other)
 * @param grossWage - Gross wage amount
 * @param deductionInputs - Deduction input parameters
 * @returns Voluntary deduction amounts
 */
export const calculateVoluntaryDeductions = (
  grossWage: number,
  deductionInputs: DeductionInputs
) => {
  const { unionDuesPercent, rrspPercent, otherDeductions } = deductionInputs;

  const union = round2((grossWage * unionDuesPercent) / 100);
  const rrsp = round2((grossWage * rrspPercent) / 100);
  const other = round2(otherDeductions);

  return {
    union,
    rrsp,
    other,
    totalVoluntary: round2(union + rrsp + other)
  };
};

/**
 * Calculate complete deduction breakdown
 * @param grossWage - Gross wage amount
 * @param deductionInputs - Deduction input parameters
 * @param ytdInputs - Year-to-date input parameters
 * @param payDate - Pay date (YYYY-MM-DD format)
 * @param province - Province for tax calculation
 * @param frequency - Pay frequency
 * @param rrspAtSource - Whether RRSP reduces taxable income at source
 * @returns Complete deduction breakdown
 */
export const calculateDeductions = (
  grossWage: number,
  deductionInputs: DeductionInputs,
  ytdInputs: YTDInputs,
  payDate: string,
  province: Province,
  frequency: PayFrequency,
  rrspAtSource: boolean = true
): DeductionBreakdown => {
  const periodsPerYear = PAY_FREQUENCY_CONFIG[frequency].periods;

  // Calculate voluntary deductions
  const voluntary = calculateVoluntaryDeductions(grossWage, deductionInputs);

  // Determine RRSP at-source amount for tax calculation
  const rrspAtSourceAmount = rrspAtSource ? voluntary.rrsp : 0;

  // Calculate statutory deductions
  const statutory = calculateStatutoryDeductions(
    grossWage,
    ytdInputs.pensionableEarnings,
    ytdInputs.insurableEarnings,
    payDate,
    province,
    periodsPerYear,
    rrspAtSourceAmount
  );

  // Build complete deduction breakdown
  const total = round2(
    voluntary.union +
    voluntary.rrsp +
    voluntary.other +
    statutory.cpp.cpp1 +
    statutory.cpp.cpp2 +
    statutory.ei.ei +
    statutory.tax.federal +
    statutory.tax.provincial
  );

  return {
    union: voluntary.union,
    rrsp: voluntary.rrsp,
    other: voluntary.other,
    cpp1: statutory.cpp.cpp1,
    cpp2: statutory.cpp.cpp2,
    ei: statutory.ei.ei,
    federal: statutory.tax.federal,
    provincial: statutory.tax.provincial,
    total
  };
};

/**
 * Calculate net pay with proper rounding
 * @param grossTotal - Total gross pay (wage + allowances)
 * @param totalDeductions - Total deduction amount
 * @returns Net pay amount
 */
export const calculateNetPay = (
  grossTotal: number,
  totalDeductions: number
): number => {
  return round2(grossTotal - totalDeductions);
};

/**
 * Orchestrate complete payroll calculation
 * @param payrollInputs - Payroll input parameters
 * @param deductionInputs - Deduction input parameters
 * @param ytdInputs - Year-to-date input parameters
 * @returns Complete payroll calculation results
 */
export const calculatePayroll = (
  payrollInputs: PayrollInputs,
  deductionInputs: DeductionInputs,
  ytdInputs: YTDInputs
): PayrollResults => {
  // Calculate gross pay breakdown
  const gross = calculateGrossPay(payrollInputs);

  // Calculate deductions
  const deductions = calculateDeductions(
    gross.wage,
    deductionInputs,
    ytdInputs,
    payrollInputs.payDate,
    payrollInputs.province,
    payrollInputs.frequency,
    deductionInputs.rrspAtSource
  );

  // Calculate net pay
  const net = calculateNetPay(gross.total, deductions.total);

  return {
    gross,
    deductions,
    net
  };
};

/**
 * Calculate allowance and per diem handling
 * @param perDiemDaily - Daily per diem amount
 * @param days - Number of days
 * @param isTaxable - Whether per diem is taxable (default: false)
 * @returns Allowance calculation results
 */
export const calculateAllowances = (
  perDiemDaily: number,
  days: number,
  isTaxable: boolean = false
) => {
  const totalAmount = round2(perDiemDaily * days);
  const taxableAmount = isTaxable ? totalAmount : 0;
  const nonTaxableAmount = isTaxable ? 0 : totalAmount;

  return {
    totalAmount,
    taxableAmount,
    nonTaxableAmount,
    dailyRate: perDiemDaily,
    days
  };
};

/**
 * Calculate year-to-date projections
 * @param currentResults - Current pay period results
 * @param ytdInputs - Current year-to-date amounts
 * @param periodsRemaining - Number of pay periods remaining in year
 * @returns YTD projection results
 */
export const calculateYTDProjections = (
  currentResults: PayrollResults,
  ytdInputs: YTDInputs,
  periodsRemaining: number
) => {
  const projectedGross = ytdInputs.pensionableEarnings + (currentResults.gross.wage * periodsRemaining);
  const projectedCPP1 = ytdInputs.cpp1Paid + (currentResults.deductions.cpp1 * periodsRemaining);
  const projectedCPP2 = ytdInputs.cpp2Paid + (currentResults.deductions.cpp2 * periodsRemaining);
  const projectedEI = ytdInputs.eiPaid + (currentResults.deductions.ei * periodsRemaining);
  const projectedNet = (currentResults.net * periodsRemaining);

  return {
    projectedGross: round2(projectedGross),
    projectedCPP1: round2(projectedCPP1),
    projectedCPP2: round2(projectedCPP2),
    projectedEI: round2(projectedEI),
    projectedNet: round2(projectedNet),
    periodsRemaining
  };
};

/**
 * Calculate effective tax rates
 * @param grossWage - Gross wage amount
 * @param deductions - Deduction breakdown
 * @returns Effective tax rate analysis
 */
export const calculateEffectiveTaxRates = (
  grossWage: number,
  deductions: DeductionBreakdown
) => {
  if (grossWage <= 0) {
    return {
      totalTaxRate: 0,
      federalTaxRate: 0,
      provincialTaxRate: 0,
      cppRate: 0,
      eiRate: 0,
      totalStatutoryRate: 0
    };
  }

  const totalTaxRate = round2(((deductions.federal + deductions.provincial) / grossWage) * 100);
  const federalTaxRate = round2((deductions.federal / grossWage) * 100);
  const provincialTaxRate = round2((deductions.provincial / grossWage) * 100);
  const cppRate = round2(((deductions.cpp1 + deductions.cpp2) / grossWage) * 100);
  const eiRate = round2((deductions.ei / grossWage) * 100);
  const totalStatutoryRate = round2(((deductions.cpp1 + deductions.cpp2 + deductions.ei + deductions.federal + deductions.provincial) / grossWage) * 100);

  return {
    totalTaxRate,
    federalTaxRate,
    provincialTaxRate,
    cppRate,
    eiRate,
    totalStatutoryRate
  };
};

/**
 * Validate payroll calculation inputs
 * @param payrollInputs - Payroll input parameters
 * @param deductionInputs - Deduction input parameters
 * @param ytdInputs - Year-to-date input parameters
 * @returns Validation results
 */
export const validatePayrollInputs = (
  payrollInputs: PayrollInputs,
  deductionInputs: DeductionInputs,
  ytdInputs: YTDInputs
) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate payroll inputs
  if (payrollInputs.rate <= 0) {
    errors.push('Base rate must be greater than 0');
  }

  if (payrollInputs.straightTime < 0) {
    errors.push('Straight time hours cannot be negative');
  }

  if (payrollInputs.overtimeHalf < 0) {
    errors.push('Overtime hours cannot be negative');
  }

  if (payrollInputs.overtimeDouble < 0) {
    errors.push('Double-time hours cannot be negative');
  }

  // Validate deduction inputs
  if (deductionInputs.unionDuesPercent < 0 || deductionInputs.unionDuesPercent > 100) {
    errors.push('Union dues percentage must be between 0 and 100');
  }

  if (deductionInputs.rrspPercent < 0 || deductionInputs.rrspPercent > 100) {
    errors.push('RRSP percentage must be between 0 and 100');
  }

  // Validate YTD inputs
  if (ytdInputs.pensionableEarnings < 0) {
    errors.push('YTD pensionable earnings cannot be negative');
  }

  if (ytdInputs.insurableEarnings < 0) {
    errors.push('YTD insurable earnings cannot be negative');
  }

  // Generate warnings
  const totalHours = payrollInputs.straightTime + payrollInputs.overtimeHalf + payrollInputs.overtimeDouble;
  if (totalHours > 84) {
    warnings.push('Total hours exceed 84 per week - verify compliance with labour standards');
  }

  if (deductionInputs.rrspPercent > 18) {
    warnings.push('RRSP contribution exceeds typical 18% limit');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};