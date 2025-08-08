/**
 * Tax calculation functions for Canadian payroll
 * Supports CPP, EI, and income tax calculations for 2025
 */

import { Province, PayFrequency } from '../../types/common';
import { CPPResult, EIResult, TaxResult } from '../../types/payroll';
import { TAX_CONSTANTS_2025 } from '../../types/constants';

/**
 * Utility function to round to 2 decimal places
 */
const round2 = (value: number): number => Math.round(value * 100) / 100;

/**
 * Calculate CPP contributions (both CPP1 and CPP2)
 * @param pensionableEarnings - Pensionable earnings for this pay period
 * @param ytdPensionable - Year-to-date pensionable earnings
 * @param periodsPerYear - Number of pay periods per year
 * @returns CPP calculation results
 */
export const calculateCPP = (
  pensionableEarnings: number,
  ytdPensionable: number,
  periodsPerYear: number
): CPPResult => {
  const {
    YMPE,
    YAMPE,
    CPP_RATE,
    CPP2_RATE,
    CPP_BASIC_EXEMPTION
  } = TAX_CONSTANTS_2025;

  const cppBaseExemptionPerPay = CPP_BASIC_EXEMPTION / periodsPerYear;
  const pensionableThisPay = Math.max(0, pensionableEarnings);

  // CPP1 calculation - cap using annual room and per-pay exemption
  const cppRoom = Math.max(0, (YMPE - CPP_BASIC_EXEMPTION) - ytdPensionable);
  const cppPensionableThisPay = Math.max(0, Math.min(pensionableThisPay - cppBaseExemptionPerPay, cppRoom));
  const cpp1 = round2(cppPensionableThisPay * CPP_RATE);

  // CPP2 calculation - for earnings above YMPE up to YAMPE
  const pensionableAfterThisPay = Math.min(ytdPensionable + pensionableThisPay, YAMPE);
  const aboveYMPEBefore = Math.max(0, Math.min(ytdPensionable, YAMPE) - YMPE);
  const aboveYMPEAfter = Math.max(0, pensionableAfterThisPay - YMPE);
  const cpp2BaseThisPay = Math.max(0, aboveYMPEAfter - aboveYMPEBefore);
  const cpp2Room = Math.max(0, (YAMPE - YMPE) - (ytdPensionable > YMPE ? (Math.min(ytdPensionable, YAMPE) - YMPE) : 0));
  const cpp2Base = Math.min(cpp2BaseThisPay, cpp2Room);
  const cpp2 = round2(cpp2Base * CPP2_RATE);

  return {
    cpp1,
    cpp2,
    pensionableEarnings: cppPensionableThisPay,
    cpp2Base
  };
};

/**
 * Calculate EI premiums
 * @param insurableEarnings - Insurable earnings for this pay period
 * @param ytdInsurable - Year-to-date insurable earnings
 * @param periodsPerYear - Number of pay periods per year
 * @returns EI calculation results
 */
export const calculateEI = (
  insurableEarnings: number,
  ytdInsurable: number,
  periodsPerYear: number
): EIResult => {
  const { EI_MIE, EI_RATE } = TAX_CONSTANTS_2025;

  const insurableThisPay = Math.max(0, insurableEarnings);
  const eiRoom = Math.max(0, EI_MIE - ytdInsurable);
  const eiBase = Math.min(insurableThisPay, eiRoom);
  const ei = round2(eiBase * EI_RATE);

  return {
    ei,
    insurableEarnings: eiBase
  };
};

/**
 * Calculate progressive tax on annual income using brackets and rates
 * @param annualIncome - Annual taxable income
 * @param thresholds - Tax bracket thresholds
 * @param rates - Tax rates for each bracket
 * @returns Total tax amount
 */
const calculateProgressiveTax = (
  annualIncome: number,
  thresholds: number[],
  rates: number[]
): number => {
  let tax = 0;
  let lastThreshold = 0;
  const brackets = [...thresholds, Infinity];

  for (let i = 0; i < brackets.length; i++) {
    const upperThreshold = brackets[i];
    const rate = rates[i];
    const taxableInBracket = Math.max(0, Math.min(annualIncome, upperThreshold) - lastThreshold);
    
    if (taxableInBracket <= 0) break;
    
    tax += taxableInBracket * rate;
    lastThreshold = upperThreshold;
  }

  return tax;
};

/**
 * Calculate federal Basic Personal Amount (enhanced BPA with phase-out)
 * @param annualIncome - Annual taxable income
 * @returns Federal BPA amount
 */
const calculateFederalBPA = (annualIncome: number): number => {
  const {
    FEDERAL_BPA_MAX,
    FEDERAL_BPA_MIN,
    FEDERAL_BPA_THRESHOLD_LOW,
    FEDERAL_BPA_THRESHOLD_HIGH
  } = TAX_CONSTANTS_2025;

  if (annualIncome <= FEDERAL_BPA_THRESHOLD_LOW) {
    return FEDERAL_BPA_MAX;
  }
  
  if (annualIncome >= FEDERAL_BPA_THRESHOLD_HIGH) {
    return FEDERAL_BPA_MIN;
  }

  // Linear phase-out between thresholds
  const phaseOutRatio = (FEDERAL_BPA_THRESHOLD_HIGH - annualIncome) / 
                       (FEDERAL_BPA_THRESHOLD_HIGH - FEDERAL_BPA_THRESHOLD_LOW);
  return FEDERAL_BPA_MIN + (FEDERAL_BPA_MAX - FEDERAL_BPA_MIN) * phaseOutRatio;
};

/**
 * Calculate income tax withholding (federal and provincial)
 * @param taxableIncome - Taxable income for this pay period
 * @param payDate - Pay date (YYYY-MM-DD format)
 * @param province - Province for tax calculation
 * @param periodsPerYear - Number of pay periods per year
 * @returns Tax calculation results
 */
export const calculateIncomeTax = (
  taxableIncome: number,
  payDate: string,
  province: Province,
  periodsPerYear: number
): TaxResult => {
  const annualizedIncome = taxableIncome * periodsPerYear;
  const payDateObj = new Date(payDate + 'T00:00:00');
  const isJulyOrLater = payDateObj >= new Date('2025-07-01T00:00:00');

  const {
    FEDERAL_BRACKETS,
    FEDERAL_RATES_JAN,
    FEDERAL_RATES_JUL,
    AB_BRACKETS,
    AB_RATES_JAN,
    AB_RATES_JUL,
    CANADA_EMPLOYMENT_AMOUNT,
    AB_BPA
  } = TAX_CONSTANTS_2025;

  // Federal tax calculation with mid-year rate change
  const federalRates = isJulyOrLater ? FEDERAL_RATES_JUL : FEDERAL_RATES_JAN;
  const federalCreditRate = federalRates[0];
  
  const federalBPA = calculateFederalBPA(annualizedIncome);
  const federalBeforeCredits = calculateProgressiveTax(annualizedIncome, FEDERAL_BRACKETS, federalRates);
  const federalCredits = federalCreditRate * (federalBPA + CANADA_EMPLOYMENT_AMOUNT);
  const federalAnnual = Math.max(0, federalBeforeCredits - federalCredits);

  // Provincial tax calculation (Alberta only for now)
  let provincialAnnual = 0;
  if (province === 'AB') {
    const albertaRates = isJulyOrLater ? AB_RATES_JUL : AB_RATES_JAN;
    const albertaCreditRate = albertaRates[0];
    
    const albertaBeforeCredits = calculateProgressiveTax(annualizedIncome, AB_BRACKETS, albertaRates);
    const albertaCredits = albertaCreditRate * AB_BPA;
    provincialAnnual = Math.max(0, albertaBeforeCredits - albertaCredits);
  }

  // Convert to per-pay amounts
  const federal = round2(federalAnnual / periodsPerYear);
  const provincial = round2(provincialAnnual / periodsPerYear);

  return {
    federal,
    provincial,
    taxableIncome,
    annualizedIncome
  };
};

/**
 * Calculate all statutory deductions (CPP, EI, and income tax)
 * @param grossWage - Gross wage for this pay period
 * @param ytdPensionable - Year-to-date pensionable earnings
 * @param ytdInsurable - Year-to-date insurable earnings
 * @param payDate - Pay date (YYYY-MM-DD format)
 * @param province - Province for tax calculation
 * @param periodsPerYear - Number of pay periods per year
 * @param rrspAtSource - RRSP contribution amount deducted at source (reduces taxable income)
 * @returns Combined statutory deduction results
 */
export const calculateStatutoryDeductions = (
  grossWage: number,
  ytdPensionable: number,
  ytdInsurable: number,
  payDate: string,
  province: Province,
  periodsPerYear: number,
  rrspAtSource: number = 0
) => {
  // Calculate CPP and EI on gross wage
  const cppResult = calculateCPP(grossWage, ytdPensionable, periodsPerYear);
  const eiResult = calculateEI(grossWage, ytdInsurable, periodsPerYear);
  
  // Calculate income tax on taxable income (after RRSP at source)
  const taxableIncome = Math.max(0, grossWage - rrspAtSource);
  const taxResult = calculateIncomeTax(taxableIncome, payDate, province, periodsPerYear);

  return {
    cpp: cppResult,
    ei: eiResult,
    tax: taxResult,
    totalStatutory: cppResult.cpp1 + cppResult.cpp2 + eiResult.ei + taxResult.federal + taxResult.provincial
  };
};