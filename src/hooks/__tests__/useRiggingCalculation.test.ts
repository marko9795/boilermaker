/**
 * Tests for useRiggingCalculation hook
 */

import { renderHook, act } from '@testing-library/react';
import {
  useRiggingCalculation,
  useRiggingInputs,
  defaultRiggingInputs
} from '../useRiggingCalculation';

describe('useRiggingCalculation', () => {
  it('should calculate rigging correctly with default inputs', () => {
    const { result } = renderHook(() =>
      useRiggingCalculation(defaultRiggingInputs)
    );

    expect(result.current.results).toBeTruthy();
    expect(result.current.results?.angleFactor.angleFactor).toBeGreaterThan(1);
    expect(result.current.results?.tensionPerLeg).toBeGreaterThan(0);
    expect(result.current.validation.isValid).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should validate inputs correctly', () => {
    const invalidInputs = {
      ...defaultRiggingInputs,
      weight: -100 // Invalid negative weight
    };

    const { result } = renderHook(() =>
      useRiggingCalculation(invalidInputs)
    );

    expect(result.current.validation.isValid).toBe(false);
    expect(result.current.validation.errors.length).toBeGreaterThan(0);
  });

  it('should calculate sling efficiency', () => {
    const { result } = renderHook(() =>
      useRiggingCalculation(defaultRiggingInputs)
    );

    expect(result.current.slingEfficiency.hitchEfficiency).toBe(1); // Vertical hitch
    expect(result.current.slingEfficiency.angleEfficiency).toBeLessThan(1);
    expect(result.current.slingEfficiency.overallEfficiency).toBeLessThan(1);
  });

  it('should generate safety alerts for dangerous configurations', () => {
    const dangerousInputs = {
      ...defaultRiggingInputs,
      angle: 150, // Very wide angle
      slingWLL: 500 // Low capacity
    };

    const { result } = renderHook(() =>
      useRiggingCalculation(dangerousInputs, {
        enableSafetyAlerts: true
      })
    );

    expect(result.current.safetyAlerts.warnings.length).toBeGreaterThan(0);
  });

  it('should handle choker hitch correctly', () => {
    const chokerInputs = {
      ...defaultRiggingInputs,
      hitchType: 'choker' as const
    };

    const { result } = renderHook(() =>
      useRiggingCalculation(chokerInputs)
    );

    expect(result.current.slingEfficiency.hitchEfficiency).toBe(0.75); // Choker factor
  });
});

describe('useRiggingInputs', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useRiggingInputs());

    expect(result.current.inputs.weight).toBe(1000);
    expect(result.current.inputs.legs).toBe(2);
    expect(result.current.inputs.angle).toBe(60);
    expect(result.current.inputs.hitchType).toBe('vertical');
  });

  it('should update individual fields correctly', () => {
    const { result } = renderHook(() => useRiggingInputs());

    act(() => {
      result.current.updateField('weight', 2000);
    });

    expect(result.current.inputs.weight).toBe(2000);
  });

  it('should apply presets correctly', () => {
    const { result } = renderHook(() => useRiggingInputs());

    act(() => {
      result.current.setFourLegLift(90);
    });

    expect(result.current.inputs.legs).toBe(4);
    expect(result.current.inputs.angle).toBe(90);
    expect(result.current.inputs.hitchType).toBe('vertical');
  });

  it('should configure choker hitch correctly', () => {
    const { result } = renderHook(() => useRiggingInputs());

    act(() => {
      result.current.setChokerHitch();
    });

    expect(result.current.inputs.hitchType).toBe('choker');
    expect(result.current.inputs.legs).toBe(1);
  });
});