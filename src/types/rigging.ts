/**
 * Rigging calculation types and interfaces
 */

import { HitchType, BaseScenario } from './common';

// Core rigging input parameters
export interface RiggingInputs {
  // Hitch configuration
  hitchType: HitchType; // Type of hitch (vertical, choker, basket)
  
  // Load parameters
  weight: number; // Load weight in kg
  legs: number; // Number of sling legs
  
  // Geometry parameters
  angle: number; // Included angle at hook in degrees
  cogOffset: number; // Center of gravity offset in mm
  spacing: number; // Distance between pick points in mm
  
  // Sling specifications
  slingWLL: number; // Working Load Limit per sling in kg (vertical rating)
}

// Load distribution analysis
export interface LoadDistribution {
  // Per-leg load shares
  legLoads: number[]; // Load share for each leg (as fraction of total)
  maxTension: number; // Maximum tension in any leg (Newtons)
  minTension: number; // Minimum tension in any leg (Newtons)
  
  // Load balance analysis
  isBalanced: boolean; // Whether load is evenly distributed
  imbalanceRatio: number; // Ratio of max to min tension
}

// Angle factor calculations
export interface AngleFactorResult {
  angleFactor: number; // Angle factor (1/cos(θ/2))
  legAngle: number; // Individual leg angle from vertical (degrees)
  efficiency: number; // Lifting efficiency (1/angleFactor)
}

// Safety analysis results
export interface SafetyAnalysis {
  // Safety checks
  isWLLAdequate: boolean; // Whether sling WLL is adequate
  safetyMargin: number; // Safety margin as percentage
  
  // Required specifications
  minRequiredWLL: number; // Minimum required WLL per sling (kg)
  recommendedWLL: number; // Recommended WLL with safety factor (kg)
  
  // Warnings and recommendations
  warnings: string[]; // Safety warnings
  recommendations: string[]; // Improvement recommendations
}

// Complete rigging calculation results
export interface RiggingResults {
  // Basic calculations
  angleFactor: AngleFactorResult;
  loadDistribution: LoadDistribution;
  
  // Per-leg analysis
  tensionPerLeg: number; // Maximum tension per leg in kN
  forcePerLeg: number; // Maximum force per leg in kN
  
  // Safety analysis
  safety: SafetyAnalysis;
  
  // Summary values for display
  maxTensionKN: number; // Maximum tension in kN
  minRequiredWLL: number; // Minimum required WLL in kg
  safetyCheck: boolean; // Overall safety check result
}

// Rigging calculation constants
export interface RiggingConstants {
  // Physical constants
  GRAVITY: number; // Gravitational acceleration (m/s²)
  
  // Safety factors
  DESIGN_FACTOR: number; // Design safety factor for WLL selection
  MINIMUM_SAFETY_MARGIN: number; // Minimum acceptable safety margin (%)
  
  // Geometric limits
  MIN_ANGLE: number; // Minimum safe included angle (degrees)
  MAX_ANGLE: number; // Maximum practical included angle (degrees)
  MAX_LEGS: number; // Maximum number of sling legs
  
  // Hitch factors
  HITCH_FACTORS: Record<HitchType, number>; // Efficiency factors by hitch type
}

// Rigging scenario for saving/loading
export interface RiggingScenario extends BaseScenario {
  type: 'rigging';
  inputs: RiggingInputs;
  results: RiggingResults;
}

// Rigging preset configuration
export interface RiggingPreset {
  name: string;
  description?: string;
  inputs: Partial<RiggingInputs>;
}

// Sling specification data
export interface SlingSpecification {
  // Identification
  id: string;
  manufacturer: string;
  model: string;
  
  // Ratings by hitch type (kg)
  verticalWLL: number;
  chokerWLL: number;
  basketWLL: number;
  
  // Physical properties
  diameter?: number; // Wire rope diameter (mm)
  length?: number; // Sling length (mm)
  material: string; // Material type
  
  // Certification
  certificationDate?: string;
  inspectionDue?: string;
}

// Form validation rules for rigging inputs
export interface RiggingValidationRules {
  weight: { min: number; max: number; required: true };
  legs: { min: number; max: number; required: true };
  angle: { min: number; max: number; required: true };
  cogOffset: { min: number; max: number };
  spacing: { min: number; max: number };
  slingWLL: { min: number; max: number; required: true };
}

// Rigging calculation error types
export type RiggingCalculationError = 
  | 'INVALID_ANGLE'
  | 'INVALID_WEIGHT'
  | 'INVALID_LEGS'
  | 'INSUFFICIENT_WLL'
  | 'GEOMETRY_ERROR'
  | 'CALCULATION_ERROR';

// Rigging calculation error details
export interface RiggingError {
  type: RiggingCalculationError;
  message: string;
  field?: string;
  value?: number;
}