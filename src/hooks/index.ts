/**
 * Custom React hooks for the Boilermaker Toolbox
 * Exports all business logic and utility hooks
 */

// Payroll calculation hooks
export {
  usePayrollCalculation,
  usePayrollInputs,
  defaultPayrollInputs,
  defaultDeductionInputs,
  defaultYTDInputs
} from './usePayrollCalculation';

export type {
  UsePayrollCalculationReturn,
  UsePayrollCalculationOptions
} from './usePayrollCalculation';

// Rigging calculation hooks
export {
  useRiggingCalculation,
  useRiggingInputs,
  useRiggingSafetyMonitor,
  defaultRiggingInputs
} from './useRiggingCalculation';

export type {
  UseRiggingCalculationReturn,
  UseRiggingCalculationOptions
} from './useRiggingCalculation';

// Local storage hooks
export {
  useLocalStorage,
  useMultipleLocalStorage,
  useValidatedLocalStorage
} from './useLocalStorage';

export type {
  StorageResult,
  StorageError,
  UseLocalStorageOptions,
  MigrationFunction
} from './useLocalStorage';