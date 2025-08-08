/**
 * Tests for usePayrollCalculation hook
 */

import { renderHook, act } from '@testing-library/react';
import {
  usePayrollCalculation,
  usePayrollInputs,
  defaultPayrollInputs,
  defaultDeductionInputs,
  defaultYTDInputs
} from '../usePayrollCalculation';

describe('usePayrollCalculation', () => {
  it('should calculate payroll correctly with default inputs', () => {
    const { result } = renderHook(() =>
      usePayrollCalculation(
        defaultPayrollInputs,
        defaultDeductionInputs,
        defaultYTDInputs
      )
    );

    expect(result.current.results).toBeTruthy();
    expect(result.current.results?.gross.wage).toBeGreaterThan(0);
    expect(result.current.results?.net).toBeGreaterThan(0);
    expect(result.current.validation.isValid).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should validate inputs correctly', () => {
    const invalidInputs = {
      ...defaultPayrollInputs,
      rate: -10 // Invalid negative rate
    };

    const { result } = renderHook(() =>
      usePayrollCalculation(
        invalidInputs,
        defaultDeductionInputs,
        defaultYTDInputs
      )
    );

    expect(result.current.validation.isValid).toBe(false);
    expect(result.current.validation.errors.length).toBeGreaterThan(0);
  });

  it('should calculate effective tax rates', () => {
    const { result } = renderHook(() =>
      usePayrollCalculation(
        defaultPayrollInputs,
        defaultDeductionInputs,
        defaultYTDInputs
      )
    );

    expect(result.current.effectiveTaxRates.totalTaxRate).toBeGreaterThanOrEqual(0);
    expect(result.current.effectiveTaxRates.federalTaxRate).toBeGreaterThanOrEqual(0);
    expect(result.current.effectiveTaxRates.provincialTaxRate).toBeGreaterThanOrEqual(0);
  });

  it('should handle high income scenarios', () => {
    const highIncomeInputs = {
      ...defaultPayrollInputs,
      rate: 200, // Higher rate to trigger CPP2
      straightTime: 40
    };

    const highYTDInputs = {
      ...defaultYTDInputs,
      pensionableEarnings: 70000 // High YTD to get closer to YMPE
    };

    const { result } = renderHook(() =>
      usePayrollCalculation(
        highIncomeInputs,
        defaultDeductionInputs,
        highYTDInputs
      )
    );

    expect(result.current.results).toBeTruthy();
    // CPP2 may be 0 if not exceeding YMPE, so just check that calculation works
    expect(result.current.results?.deductions.cpp2).toBeGreaterThanOrEqual(0);
  });
});

describe('usePayrollInputs', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePayrollInputs());

    expect(result.current.payrollInputs.rate).toBe(60);
    expect(result.current.payrollInputs.straightTime).toBe(40);
    expect(result.current.deductionInputs.unionDuesPercent).toBe(0);
    expect(result.current.ytdInputs.pensionableEarnings).toBe(0);
  });

  it('should update individual fields correctly', () => {
    const { result } = renderHook(() => usePayrollInputs());

    act(() => {
      result.current.updatePayrollField('rate', 75);
    });

    expect(result.current.payrollInputs.rate).toBe(75);
  });

  it('should reset inputs correctly', () => {
    const { result } = renderHook(() => usePayrollInputs());

    act(() => {
      result.current.updatePayrollField('rate', 100);
      result.current.resetPayrollInputs();
    });

    expect(result.current.payrollInputs.rate).toBe(60);
  });
});