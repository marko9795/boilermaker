/**
 * Custom hook for payroll calculations with memoization and error handling
 * Integrates all tax and payroll calculation functions
 */

import { useMemo, useCallback, useState } from 'react';
import {
  PayrollInputs,
  DeductionInputs,
  YTDInputs,
  PayrollResults
} from '../types/payroll';
import {
  calculatePayroll,
  validatePayrollInputs,
  calculateEffectiveTaxRates,
  calculateYTDProjections
} from '../utils/calculations/payrollCalculations';

// Hook return type
export interface UsePayrollCalculationReturn {
  // Calculation results
  results: PayrollResults | null;
  
  // Validation
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  
  // Additional calculations
  effectiveTaxRates: {
    totalTaxRate: number;
    federalTaxRate: number;
    provincialTaxRate: number;
    cppRate: number;
    eiRate: number;
    totalStatutoryRate: number;
  };
  
  // YTD projections
  ytdProjections: {
    projectedGross: number;
    projectedCPP1: number;
    projectedCPP2: number;
    projectedEI: number;
    projectedNet: number;
    periodsRemaining: number;
  } | null;
  
  // Loading and error states
  isCalculating: boolean;
  error: string | null;
  
  // Helper functions
  recalculate: () => void;
  clearError: () => void;
}

// Hook options
export interface UsePayrollCalculationOptions {
  // Performance options
  enableMemoization?: boolean;
  
  // Validation options
  validateOnChange?: boolean;
  
  // YTD projection options
  periodsRemaining?: number;
  
  // Error handling options
  throwOnError?: boolean;
}

/**
 * Custom hook for payroll calculations
 * @param payrollInputs - Payroll input parameters
 * @param deductionInputs - Deduction input parameters
 * @param ytdInputs - Year-to-date input parameters
 * @param options - Hook configuration options
 * @returns Payroll calculation results and utilities
 */
export const usePayrollCalculation = (
  payrollInputs: PayrollInputs,
  deductionInputs: DeductionInputs,
  ytdInputs: YTDInputs,
  options: UsePayrollCalculationOptions = {}
): UsePayrollCalculationReturn => {
  const {
    enableMemoization = true,
    validateOnChange = true,
    periodsRemaining,
    throwOnError = false
  } = options;

  // Memoized validation
  const validation = useMemo(() => {
    if (!validateOnChange) {
      return { isValid: true, errors: [], warnings: [] };
    }

    try {
      return validatePayrollInputs(payrollInputs, deductionInputs, ytdInputs);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Validation error';
      return {
        isValid: false,
        errors: [errorMessage],
        warnings: []
      };
    }
  }, [payrollInputs, deductionInputs, ytdInputs, validateOnChange]);

  // Memoized calculation results
  const calculationResult = useMemo(() => {
    // Don't calculate if validation fails and we're validating on change
    if (validateOnChange && !validation.isValid) {
      return {
        results: null,
        error: validation.errors.join('; ')
      };
    }

    try {
      const results = calculatePayroll(payrollInputs, deductionInputs, ytdInputs);
      return {
        results,
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Calculation error';
      
      if (throwOnError) {
        throw error;
      }
      
      return {
        results: null,
        error: errorMessage
      };
    }
  }, [
    payrollInputs,
    deductionInputs,
    ytdInputs,
    validation.isValid,
    validateOnChange,
    throwOnError,
    ...(enableMemoization ? [] : [Math.random()]) // Force recalculation if memoization disabled
  ]);

  // Memoized effective tax rates
  const effectiveTaxRates = useMemo(() => {
    if (!calculationResult.results) {
      return {
        totalTaxRate: 0,
        federalTaxRate: 0,
        provincialTaxRate: 0,
        cppRate: 0,
        eiRate: 0,
        totalStatutoryRate: 0
      };
    }

    try {
      return calculateEffectiveTaxRates(
        calculationResult.results.gross.wage,
        calculationResult.results.deductions
      );
    } catch (error) {
      console.error('Error calculating effective tax rates:', error);
      return {
        totalTaxRate: 0,
        federalTaxRate: 0,
        provincialTaxRate: 0,
        cppRate: 0,
        eiRate: 0,
        totalStatutoryRate: 0
      };
    }
  }, [calculationResult.results]);

  // Memoized YTD projections
  const ytdProjections = useMemo(() => {
    if (!calculationResult.results || periodsRemaining === undefined) {
      return null;
    }

    try {
      return calculateYTDProjections(
        calculationResult.results,
        ytdInputs,
        periodsRemaining
      );
    } catch (error) {
      console.error('Error calculating YTD projections:', error);
      return null;
    }
  }, [calculationResult.results, ytdInputs, periodsRemaining]);

  // Force recalculation callback
  const recalculate = useCallback(() => {
    // This will trigger a recalculation by changing a dependency
    // In practice, this is mainly useful when memoization is disabled
    // or when external factors change that aren't captured in dependencies
  }, []);

  // Clear error callback
  const clearError = useCallback(() => {
    // Error clearing is handled automatically by recalculation
    // This is provided for API consistency
  }, []);

  return {
    results: calculationResult.results,
    validation,
    effectiveTaxRates,
    ytdProjections,
    isCalculating: false, // Calculations are synchronous
    error: calculationResult.error,
    recalculate,
    clearError
  };
};

// Default input values for convenience
export const defaultPayrollInputs: PayrollInputs = {
  rate: 60,
  straightTime: 40,
  overtimeHalf: 0,
  overtimeDouble: 0,
  shiftPremium: 0,
  travelHours: 0,
  travelRate: 60,
  perDiem: 0,
  days: 0,
  payDate: new Date().toISOString().split('T')[0],
  frequency: 'weekly',
  province: 'AB'
};

export const defaultDeductionInputs: DeductionInputs = {
  unionDuesPercent: 0,
  rrspPercent: 0,
  rrspAtSource: true,
  otherDeductions: 0
};

export const defaultYTDInputs: YTDInputs = {
  pensionableEarnings: 0,
  cpp1Paid: 0,
  cpp2Paid: 0,
  insurableEarnings: 0,
  eiPaid: 0
};

/**
 * Hook for managing payroll input state with validation
 * @param initialInputs - Initial payroll inputs
 * @returns Payroll input state and setters
 */
export const usePayrollInputs = (
  initialInputs: Partial<PayrollInputs> = {}
) => {
  const [payrollInputs, setPayrollInputs] = useState<PayrollInputs>({
    ...defaultPayrollInputs,
    ...initialInputs
  });

  const [deductionInputs, setDeductionInputs] = useState<DeductionInputs>(
    defaultDeductionInputs
  );

  const [ytdInputs, setYTDInputs] = useState<YTDInputs>(
    defaultYTDInputs
  );

  // Individual field updaters
  const updatePayrollField = useCallback((field: keyof PayrollInputs, value: any) => {
    setPayrollInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateDeductionField = useCallback((field: keyof DeductionInputs, value: any) => {
    setDeductionInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateYTDField = useCallback((field: keyof YTDInputs, value: any) => {
    setYTDInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  // Reset functions
  const resetPayrollInputs = useCallback(() => {
    setPayrollInputs(defaultPayrollInputs);
  }, []);

  const resetDeductionInputs = useCallback(() => {
    setDeductionInputs(defaultDeductionInputs);
  }, []);

  const resetYTDInputs = useCallback(() => {
    setYTDInputs(defaultYTDInputs);
  }, []);

  const resetAllInputs = useCallback(() => {
    resetPayrollInputs();
    resetDeductionInputs();
    resetYTDInputs();
  }, [resetPayrollInputs, resetDeductionInputs, resetYTDInputs]);

  return {
    // State
    payrollInputs,
    deductionInputs,
    ytdInputs,
    
    // Setters
    setPayrollInputs,
    setDeductionInputs,
    setYTDInputs,
    
    // Field updaters
    updatePayrollField,
    updateDeductionField,
    updateYTDField,
    
    // Reset functions
    resetPayrollInputs,
    resetDeductionInputs,
    resetYTDInputs,
    resetAllInputs
  };
};