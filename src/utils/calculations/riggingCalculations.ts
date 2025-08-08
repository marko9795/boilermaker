/**
 * Rigging calculation functions for load analysis and safety validation
 * Supports multi-leg lifts with angle factors, load distribution, and safety checks
 */

import { HitchType } from '../../types/common';
import { 
  RiggingInputs, 
  LoadDistribution, 
  AngleFactorResult, 
  SafetyAnalysis,
  RiggingResults 
} from '../../types/rigging';
import { RIGGING_CONSTANTS } from '../../types/constants';

/**
 * Calculate angle factor for sling legs
 * @param includedAngle - Included angle at hook in degrees
 * @returns Angle factor calculation results
 */
export const calculateAngleFactor = (includedAngle: number): AngleFactorResult => {
  // Convert included angle to individual leg angle from vertical
  const legAngleRadians = (includedAngle / 2) * (Math.PI / 180);
  const legAngleDegrees = includedAngle / 2;
  
  // Angle factor AF = 1 / cos(θ/2) where θ is included angle
  const angleFactor = 1 / Math.cos(legAngleRadians);
  
  // Lifting efficiency is inverse of angle factor
  const efficiency = 1 / angleFactor;

  return {
    angleFactor,
    legAngle: legAngleDegrees,
    efficiency
  };
};

/**
 * Calculate load distribution for multi-leg lifts with center of gravity offset
 * @param weight - Total load weight in kg
 * @param legs - Number of sling legs
 * @param cogOffset - Center of gravity offset in mm (positive toward leg A)
 * @param spacing - Distance between pick points in mm
 * @returns Load distribution analysis
 */
export const calculateLoadDistribution = (
  weight: number,
  legs: number,
  cogOffset: number,
  spacing: number
): LoadDistribution => {
  const { GRAVITY } = RIGGING_CONSTANTS;
  const totalForceN = weight * GRAVITY;
  
  // Initialize leg loads array
  const legLoads: number[] = new Array(legs).fill(1 / legs);
  
  // For two-leg lifts with CoG offset, calculate load sharing using lever principle
  if (legs === 2 && spacing > 0 && Math.abs(cogOffset) > 1) {
    const distanceToLegA = spacing / 2 + cogOffset; // Distance from CoG to leg A
    const distanceToLegB = spacing / 2 - cogOffset; // Distance from CoG to leg B
    const totalDistance = distanceToLegA + distanceToLegB;
    
    // Load sharing: leg closer to CoG takes less load (inverse relationship)
    legLoads[0] = distanceToLegB / totalDistance; // Leg A load share
    legLoads[1] = distanceToLegA / totalDistance; // Leg B load share
  }
  
  // Calculate actual forces per leg
  const legForcesN = legLoads.map(share => totalForceN * share);
  const maxTension = Math.max(...legForcesN);
  const minTension = Math.min(...legForcesN);
  
  // Analyze load balance
  const imbalanceRatio = maxTension / minTension;
  const isBalanced = imbalanceRatio <= 1.1; // Consider balanced if within 10%

  return {
    legLoads,
    maxTension,
    minTension,
    isBalanced,
    imbalanceRatio
  };
};

/**
 * Calculate center of gravity effects on load distribution
 * @param weight - Load weight in kg
 * @param cogOffset - Center of gravity offset in mm
 * @param spacing - Distance between pick points in mm
 * @returns CoG analysis results
 */
export const calculateCenterOfGravityEffects = (
  weight: number,
  cogOffset: number,
  spacing: number
) => {
  if (spacing <= 0) {
    return {
      momentArm: 0,
      additionalLoad: 0,
      loadShiftPercentage: 0
    };
  }

  const momentArm = Math.abs(cogOffset);
  const leverRatio = momentArm / (spacing / 2);
  const loadShiftPercentage = (leverRatio / (1 + leverRatio)) * 100;
  const additionalLoad = weight * leverRatio / 2;

  return {
    momentArm,
    additionalLoad,
    loadShiftPercentage
  };
};

/**
 * Calculate safety factors and perform WLL validation
 * @param maxTensionN - Maximum tension in any leg (Newtons)
 * @param slingWLL - Working Load Limit per sling in kg (vertical rating)
 * @param hitchType - Type of hitch (affects capacity)
 * @returns Safety analysis results
 */
export const calculateSafetyFactors = (
  maxTensionN: number,
  slingWLL: number,
  hitchType: HitchType
): SafetyAnalysis => {
  const { DESIGN_FACTOR, MINIMUM_SAFETY_MARGIN, HITCH_FACTORS } = RIGGING_CONSTANTS;
  
  // Apply hitch factor to get effective WLL
  const hitchFactor = HITCH_FACTORS[hitchType];
  const effectiveWLLkg = slingWLL * hitchFactor;
  const effectiveWLLN = effectiveWLLkg * 9.80665;
  
  // Calculate safety margin
  const safetyMargin = ((effectiveWLLN - maxTensionN) / maxTensionN) * 100;
  const isWLLAdequate = safetyMargin >= MINIMUM_SAFETY_MARGIN;
  
  // Calculate minimum required WLL with design factor
  const minRequiredWLLN = maxTensionN * DESIGN_FACTOR;
  const minRequiredWLL = minRequiredWLLN / 9.80665; // Convert to kg
  const recommendedWLL = minRequiredWLL * 1.1; // Add 10% buffer
  
  // Generate warnings and recommendations
  const warnings: string[] = [];
  const recommendations: string[] = [];
  
  if (!isWLLAdequate) {
    warnings.push(`Insufficient sling capacity. Safety margin: ${safetyMargin.toFixed(1)}%`);
    recommendations.push(`Use slings with minimum ${minRequiredWLL.toFixed(0)} kg WLL`);
  }
  
  if (safetyMargin < 50) {
    warnings.push('Low safety margin - consider higher capacity slings');
  }
  
  if (hitchType === 'choker') {
    recommendations.push('Choker hitch reduces capacity to 75% of vertical rating');
  }
  
  if (hitchType === 'basket') {
    recommendations.push('Basket hitch doubles capacity but requires proper load support');
  }

  return {
    isWLLAdequate,
    safetyMargin,
    minRequiredWLL,
    recommendedWLL,
    warnings,
    recommendations
  };
};

/**
 * Validate rigging geometry and parameters
 * @param inputs - Rigging input parameters
 * @returns Validation results with any geometry warnings
 */
export const validateRiggingGeometry = (inputs: RiggingInputs) => {
  const { MIN_ANGLE, MAX_ANGLE, MAX_LEGS } = RIGGING_CONSTANTS;
  const warnings: string[] = [];
  const isValid = true;

  // Validate angle range
  if (inputs.angle < MIN_ANGLE) {
    warnings.push(`Included angle too small (${inputs.angle}°). Minimum recommended: ${MIN_ANGLE}°`);
  }
  
  if (inputs.angle > MAX_ANGLE) {
    warnings.push(`Included angle too large (${inputs.angle}°). Maximum recommended: ${MAX_ANGLE}°`);
  }
  
  // Validate number of legs
  if (inputs.legs > MAX_LEGS) {
    warnings.push(`Too many legs (${inputs.legs}). Maximum supported: ${MAX_LEGS}`);
  }
  
  // Validate weight
  if (inputs.weight <= 0) {
    warnings.push('Load weight must be greater than zero');
  }
  
  // Validate sling WLL
  if (inputs.slingWLL <= 0) {
    warnings.push('Sling WLL must be greater than zero');
  }
  
  // Geometry-specific warnings
  if (inputs.angle > 120) {
    warnings.push('Wide angles significantly increase sling tension - consider reducing angle');
  }
  
  if (Math.abs(inputs.cogOffset) > inputs.spacing / 2) {
    warnings.push('CoG offset exceeds half the pick spacing - load may be unstable');
  }

  return {
    isValid,
    warnings
  };
};

/**
 * Perform complete rigging calculation analysis
 * @param inputs - Rigging input parameters
 * @returns Complete rigging calculation results
 */
export const calculateRiggingAnalysis = (inputs: RiggingInputs): RiggingResults => {
  // Validate inputs
  const geometryValidation = validateRiggingGeometry(inputs);
  
  // Calculate angle factor
  const angleFactor = calculateAngleFactor(inputs.angle);
  
  // Calculate load distribution
  const loadDistribution = calculateLoadDistribution(
    inputs.weight,
    inputs.legs,
    inputs.cogOffset,
    inputs.spacing
  );
  
  // Apply angle factor to get actual tensions
  const maxTensionWithAngle = loadDistribution.maxTension * angleFactor.angleFactor;
  
  // Calculate safety analysis
  const safety = calculateSafetyFactors(
    maxTensionWithAngle,
    inputs.slingWLL,
    inputs.hitchType
  );
  
  // Add geometry warnings to safety warnings
  safety.warnings.push(...geometryValidation.warnings);
  
  // Calculate summary values
  const tensionPerLeg = maxTensionWithAngle / 1000; // Convert to kN
  const forcePerLeg = maxTensionWithAngle / 1000; // Convert to kN
  const maxTensionKN = maxTensionWithAngle / 1000; // Convert to kN
  const safetyCheck = safety.isWLLAdequate && geometryValidation.isValid;

  return {
    angleFactor,
    loadDistribution,
    tensionPerLeg,
    forcePerLeg,
    safety,
    maxTensionKN,
    minRequiredWLL: safety.minRequiredWLL,
    safetyCheck
  };
};

/**
 * Calculate sling efficiency for different hitch types
 * @param hitchType - Type of hitch
 * @param angle - Included angle in degrees
 * @returns Efficiency analysis
 */
export const calculateSlingEfficiency = (hitchType: HitchType, angle: number) => {
  const { HITCH_FACTORS } = RIGGING_CONSTANTS;
  const angleFactor = calculateAngleFactor(angle);
  
  const hitchFactor = HITCH_FACTORS[hitchType];
  const overallEfficiency = (hitchFactor * angleFactor.efficiency);
  
  return {
    hitchEfficiency: hitchFactor,
    angleEfficiency: angleFactor.efficiency,
    overallEfficiency,
    capacityReduction: (1 - overallEfficiency) * 100
  };
};