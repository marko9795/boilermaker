/**
 * Custom hook for rigging calculations with real-time updates and safety validation
 * Integrates rigging calculation functions with memoization and error handling
 */

import { useMemo, useCallback, useState, useEffect } from 'react';
import {
  RiggingInputs,
  RiggingResults,
  RiggingError,
  RiggingCalculationError
} from '../types/rigging';
import {
  calculateRiggingAnalysis,
  validateRiggingGeometry,
  calculateSlingEfficiency,
  calculateCenterOfGravityEffects
} from '../utils/calculations/riggingCalculations';

// Hook return type
export interface UseRiggingCalculationReturn {
  // Calculation results
  results: RiggingResults | null;
  
  // Validation and safety
  validation: {
    isValid: boolean;
    warnings: string[];
    errors: RiggingError[];
  };
  
  // Additional analysis
  slingEfficiency: {
    hitchEfficiency: number;
    angleEfficiency: number;
    overallEfficiency: number;
    capacityReduction: number;
  };
  
  cogEffects: {
    momentArm: number;
    additionalLoad: number;
    loadShiftPercentage: number;
  };
  
  // Safety alerts
  safetyAlerts: {
    critical: string[];
    warnings: string[];
    recommendations: string[];
  };
  
  // Loading and error states
  isCalculating: boolean;
  error: string | null;
  
  // Helper functions
  recalculate: () => void;
  clearError: () => void;
  validateInputs: () => boolean;
}

// Hook options
export interface UseRiggingCalculationOptions {
  // Performance options
  enableMemoization?: boolean;
  enableRealTimeUpdates?: boolean;
  
  // Validation options
  validateOnChange?: boolean;
  strictValidation?: boolean;
  
  // Safety options
  enableSafetyAlerts?: boolean;
  alertThresholds?: {
    minSafetyMargin?: number;
    maxAngle?: number;
    maxImbalance?: number;
  };
  
  // Error handling options
  throwOnError?: boolean;
}

/**
 * Custom hook for rigging calculations
 * @param inputs - Rigging input parameters
 * @param options - Hook configuration options
 * @returns Rigging calculation results and utilities
 */
export const useRiggingCalculation = (
  inputs: RiggingInputs,
  options: UseRiggingCalculationOptions = {}
): UseRiggingCalculationReturn => {
  const {
    enableMemoization = true,
    enableRealTimeUpdates = true,
    validateOnChange = true,
    strictValidation = false,
    enableSafetyAlerts = true,
    alertThresholds = {
      minSafetyMargin: 25,
      maxAngle: 120,
      maxImbalance: 1.2
    },
    throwOnError = false
  } = options;

  // Internal state for error tracking
  const [internalError, setInternalError] = useState<string | null>(null);

  // Memoized input validation
  const validation = useMemo(() => {
    if (!validateOnChange) {
      return { isValid: true, warnings: [], errors: [] };
    }

    try {
      const geometryValidation = validateRiggingGeometry(inputs);
      const errors: RiggingError[] = [];
      
      // Basic input validation
      if (inputs.weight <= 0) {
        errors.push({
          type: 'INVALID_WEIGHT',
          message: 'Load weight must be greater than zero',
          field: 'weight',
          value: inputs.weight
        });
      }
      
      if (inputs.legs < 1 || inputs.legs > 8) {
        errors.push({
          type: 'INVALID_LEGS',
          message: 'Number of legs must be between 1 and 8',
          field: 'legs',
          value: inputs.legs
        });
      }
      
      if (inputs.angle <= 0 || inputs.angle > 180) {
        errors.push({
          type: 'INVALID_ANGLE',
          message: 'Included angle must be between 0 and 180 degrees',
          field: 'angle',
          value: inputs.angle
        });
      }
      
      if (inputs.slingWLL <= 0) {
        errors.push({
          type: 'INSUFFICIENT_WLL',
          message: 'Sling WLL must be greater than zero',
          field: 'slingWLL',
          value: inputs.slingWLL
        });
      }

      // Strict validation checks
      if (strictValidation) {
        if (inputs.angle < 30) {
          errors.push({
            type: 'INVALID_ANGLE',
            message: 'Included angle too small for safe lifting',
            field: 'angle',
            value: inputs.angle
          });
        }
        
        if (inputs.angle > 120) {
          errors.push({
            type: 'INVALID_ANGLE',
            message: 'Included angle too large - excessive sling tension',
            field: 'angle',
            value: inputs.angle
          });
        }
      }

      return {
        isValid: errors.length === 0,
        warnings: geometryValidation.warnings,
        errors
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Validation error';
      return {
        isValid: false,
        warnings: [],
        errors: [{
          type: 'CALCULATION_ERROR' as RiggingCalculationError,
          message: errorMessage
        }]
      };
    }
  }, [inputs, validateOnChange, strictValidation]);

  // Memoized calculation results
  const calculationResult = useMemo(() => {
    // Don't calculate if validation fails and we're validating on change
    if (validateOnChange && !validation.isValid) {
      return {
        results: null,
        error: validation.errors.map(e => e.message).join('; ')
      };
    }

    try {
      setInternalError(null);
      const results = calculateRiggingAnalysis(inputs);
      return {
        results,
        error: null
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Calculation error';
      
      if (throwOnError) {
        throw error;
      }
      
      setInternalError(errorMessage);
      return {
        results: null,
        error: errorMessage
      };
    }
  }, [
    inputs,
    validation.isValid,
    validateOnChange,
    throwOnError,
    ...(enableMemoization ? [] : [Math.random()]) // Force recalculation if memoization disabled
  ]);

  // Memoized sling efficiency calculation
  const slingEfficiency = useMemo(() => {
    try {
      return calculateSlingEfficiency(inputs.hitchType, inputs.angle);
    } catch (error) {
      console.error('Error calculating sling efficiency:', error);
      return {
        hitchEfficiency: 1,
        angleEfficiency: 1,
        overallEfficiency: 1,
        capacityReduction: 0
      };
    }
  }, [inputs.hitchType, inputs.angle]);

  // Memoized center of gravity effects
  const cogEffects = useMemo(() => {
    try {
      return calculateCenterOfGravityEffects(
        inputs.weight,
        inputs.cogOffset,
        inputs.spacing
      );
    } catch (error) {
      console.error('Error calculating CoG effects:', error);
      return {
        momentArm: 0,
        additionalLoad: 0,
        loadShiftPercentage: 0
      };
    }
  }, [inputs.weight, inputs.cogOffset, inputs.spacing]);

  // Memoized safety alerts
  const safetyAlerts = useMemo(() => {
    if (!enableSafetyAlerts || !calculationResult.results) {
      return {
        critical: [],
        warnings: [],
        recommendations: []
      };
    }

    const critical: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    const { results } = calculationResult;
    const { safety, loadDistribution } = results;

    // Critical safety issues
    if (!safety.isWLLAdequate) {
      critical.push('CRITICAL: Sling capacity insufficient for load');
    }

    if (safety.safetyMargin < 0) {
      critical.push('CRITICAL: Load exceeds sling working load limit');
    }

    // Safety warnings
    if (safety.safetyMargin < (alertThresholds.minSafetyMargin || 25)) {
      warnings.push(`Low safety margin: ${safety.safetyMargin.toFixed(1)}%`);
    }

    if (inputs.angle > (alertThresholds.maxAngle || 120)) {
      warnings.push(`Wide sling angle increases tension significantly`);
    }

    if (loadDistribution.imbalanceRatio > (alertThresholds.maxImbalance || 1.2)) {
      warnings.push(`Unbalanced load distribution detected`);
    }

    // Add safety recommendations
    recommendations.push(...safety.recommendations);

    if (slingEfficiency.overallEfficiency < 0.5) {
      recommendations.push('Consider reducing sling angle or changing hitch type');
    }

    if (Math.abs(inputs.cogOffset) > inputs.spacing * 0.3) {
      recommendations.push('Large CoG offset - verify load stability');
    }

    return {
      critical,
      warnings,
      recommendations
    };
  }, [
    enableSafetyAlerts,
    calculationResult.results,
    alertThresholds,
    slingEfficiency.overallEfficiency,
    inputs.cogOffset,
    inputs.spacing
  ]);

  // Real-time update effect
  useEffect(() => {
    if (!enableRealTimeUpdates) return;

    // This effect runs whenever inputs change, triggering recalculation
    // The actual recalculation is handled by the memoized values above
  }, [inputs, enableRealTimeUpdates]);

  // Force recalculation callback
  const recalculate = useCallback(() => {
    setInternalError(null);
    // Force recalculation by updating a dependency
    // In practice, this is mainly useful when memoization is disabled
  }, []);

  // Clear error callback
  const clearError = useCallback(() => {
    setInternalError(null);
  }, []);

  // Input validation callback
  const validateInputs = useCallback(() => {
    return validation.isValid;
  }, [validation.isValid]);

  return {
    results: calculationResult.results,
    validation,
    slingEfficiency,
    cogEffects,
    safetyAlerts,
    isCalculating: false, // Calculations are synchronous
    error: internalError || calculationResult.error,
    recalculate,
    clearError,
    validateInputs
  };
};

// Default input values for convenience
export const defaultRiggingInputs: RiggingInputs = {
  hitchType: 'vertical',
  weight: 1000,
  legs: 2,
  angle: 60,
  cogOffset: 0,
  spacing: 1000,
  slingWLL: 2000
};

/**
 * Hook for managing rigging input state with validation
 * @param initialInputs - Initial rigging inputs
 * @returns Rigging input state and setters
 */
export const useRiggingInputs = (
  initialInputs: Partial<RiggingInputs> = {}
) => {
  const [inputs, setInputs] = useState<RiggingInputs>({
    ...defaultRiggingInputs,
    ...initialInputs
  });

  // Individual field updaters
  const updateField = useCallback((field: keyof RiggingInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  // Preset appliers
  const applyPreset = useCallback((preset: Partial<RiggingInputs>) => {
    setInputs(prev => ({ ...prev, ...preset }));
  }, []);

  // Reset function
  const resetInputs = useCallback(() => {
    setInputs(defaultRiggingInputs);
  }, []);

  // Quick configuration helpers
  const setTwoLegLift = useCallback((angle: number = 60) => {
    setInputs(prev => ({
      ...prev,
      legs: 2,
      angle,
      hitchType: 'vertical'
    }));
  }, []);

  const setFourLegLift = useCallback((angle: number = 90) => {
    setInputs(prev => ({
      ...prev,
      legs: 4,
      angle,
      hitchType: 'vertical'
    }));
  }, []);

  const setChokerHitch = useCallback(() => {
    setInputs(prev => ({
      ...prev,
      hitchType: 'choker',
      legs: 1
    }));
  }, []);

  const setBasketHitch = useCallback(() => {
    setInputs(prev => ({
      ...prev,
      hitchType: 'basket',
      legs: 1
    }));
  }, []);

  return {
    // State
    inputs,
    setInputs,
    
    // Field updater
    updateField,
    
    // Preset functions
    applyPreset,
    resetInputs,
    
    // Quick configuration
    setTwoLegLift,
    setFourLegLift,
    setChokerHitch,
    setBasketHitch
  };
};

/**
 * Hook for rigging safety monitoring with alerts
 * @param results - Rigging calculation results
 * @param options - Monitoring options
 * @returns Safety monitoring state and controls
 */
export const useRiggingSafetyMonitor = (
  results: RiggingResults | null,
  options: {
    enableAlerts?: boolean;
    alertSound?: boolean;
    criticalThreshold?: number;
  } = {}
) => {
  const { enableAlerts = true, alertSound = false, criticalThreshold = 10 } = options;
  
  const [alertsAcknowledged, setAlertsAcknowledged] = useState<Set<string>>(new Set());
  const [alertHistory, setAlertHistory] = useState<Array<{
    timestamp: Date;
    type: 'critical' | 'warning';
    message: string;
  }>>([]);

  // Monitor for critical safety issues
  useEffect(() => {
    if (!enableAlerts || !results) return;

    const { safety } = results;
    
    // Check for critical safety margin
    if (safety.safetyMargin < criticalThreshold) {
      const alertKey = `critical-margin-${safety.safetyMargin.toFixed(1)}`;
      
      if (!alertsAcknowledged.has(alertKey)) {
        const alert = {
          timestamp: new Date(),
          type: 'critical' as const,
          message: `Critical: Safety margin only ${safety.safetyMargin.toFixed(1)}%`
        };
        
        setAlertHistory(prev => [alert, ...prev.slice(0, 9)]); // Keep last 10 alerts
        
        if (alertSound && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance('Critical safety alert');
          speechSynthesis.speak(utterance);
        }
      }
    }
  }, [results, enableAlerts, alertSound, criticalThreshold, alertsAcknowledged]);

  const acknowledgeAlert = useCallback((alertKey: string) => {
    setAlertsAcknowledged(prev => new Set([...prev, alertKey]));
  }, []);

  const clearAlertHistory = useCallback(() => {
    setAlertHistory([]);
    setAlertsAcknowledged(new Set());
  }, []);

  return {
    alertHistory,
    acknowledgeAlert,
    clearAlertHistory,
    hasUnacknowledgedAlerts: alertHistory.some(alert => 
      !alertsAcknowledged.has(`${alert.type}-${alert.message}`)
    )
  };
};