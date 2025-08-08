/**
 * Calculation utilities index
 * Exports all calculation functions for easy importing
 */

// Tax calculations
export {
  calculateCPP,
  calculateEI,
  calculateIncomeTax,
  calculateStatutoryDeductions
} from './taxCalculations';

// Rigging calculations
export {
  calculateAngleFactor,
  calculateLoadDistribution,
  calculateCenterOfGravityEffects,
  calculateSafetyFactors,
  validateRiggingGeometry,
  calculateRiggingAnalysis,
  calculateSlingEfficiency
} from './riggingCalculations';

// Payroll calculations
export {
  calculateGrossPay,
  calculateVoluntaryDeductions,
  calculateDeductions,
  calculateNetPay,
  calculatePayroll,
  calculateAllowances,
  calculateYTDProjections,
  calculateEffectiveTaxRates,
  validatePayrollInputs
} from './payrollCalculations';