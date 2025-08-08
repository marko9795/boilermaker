# TypeScript Type Definitions

This directory contains comprehensive TypeScript type definitions for the Boilermaker Toolbox application. The types are organized into logical modules to provide strong type safety and excellent developer experience.

## File Structure

```
src/types/
├── common.ts          # Common types and enums used across the application
├── payroll.ts         # Payroll calculation types and interfaces
├── rigging.ts         # Rigging calculation types and interfaces
├── contracts.ts       # Contract management types
├── scenarios.ts       # Scenario management types
├── ui.ts             # UI component types and interfaces
├── errors.ts         # Error handling types
├── validation.ts     # Form validation types and schemas
├── constants.ts      # Application constants and configuration types
├── index.ts          # Main export file
└── __tests__/        # Type definition tests
```

## Key Type Categories

### 1. Common Types (`common.ts`)

Base types used throughout the application:

- `Province` - Canadian provinces and territories
- `PayFrequency` - Pay period frequencies (weekly, biweekly, etc.)
- `HitchType` - Rigging hitch types (vertical, choker, basket)
- `AppTab` - Application navigation tabs
- `BaseScenario` - Base interface for saved scenarios

### 2. Payroll Types (`payroll.ts`)

Comprehensive types for payroll calculations:

- `PayrollInputs` - Core payroll input data
- `DeductionInputs` - Deduction-related inputs
- `YTDInputs` - Year-to-date tracking inputs
- `PayrollResults` - Complete calculation results
- `TaxConstants` - Tax calculation constants for 2025
- `PayrollScenario` - Saved payroll scenarios

### 3. Rigging Types (`rigging.ts`)

Types for rigging calculations and safety analysis:

- `RiggingInputs` - Core rigging parameters
- `RiggingResults` - Complete calculation results
- `LoadDistribution` - Load distribution analysis
- `SafetyAnalysis` - Safety checks and recommendations
- `RiggingConstants` - Physical and safety constants

### 4. Contract Types (`contracts.ts`)

Contract management and application:

- `Contract` - Core contract data structure
- `OvertimeRule` - Overtime rule definitions
- `ContractPreset` - Quick setup templates
- `ContractFilters` - Search and filtering options

### 5. Scenario Types (`scenarios.ts`)

Saved scenario management:

- `Scenario` - Union type for all scenario types
- `ScenarioComparison` - Scenario comparison data
- `ScenarioFilters` - Search and filtering
- `ScenarioStats` - Usage statistics

### 6. UI Types (`ui.ts`)

Component interfaces and props:

- `CardProps`, `FieldProps`, `InputProps` - Basic UI components
- `TableProps`, `ModalProps`, `ButtonProps` - Complex components
- `ThemeContextValue` - Theme management
- `ErrorBoundaryProps` - Error handling components

### 7. Error Types (`errors.ts`)

Comprehensive error handling:

- `AppError` - Application error interface
- `ErrorType` - Error categorization
- `ValidationErrorDetails` - Validation error specifics
- `ErrorRecoveryOptions` - Error recovery mechanisms

### 8. Validation Types (`validation.ts`)

Form validation framework:

- `ValidationRule` - Individual field validation rules
- `FormValidationResult` - Complete form validation
- `ValidationRules` - Pre-built validation rule builders
- `VALIDATION_PATTERNS` - Common regex patterns

### 9. Constants (`constants.ts`)

Application configuration and constants:

- `AppConfig` - Application configuration interface
- `TAX_CONSTANTS_2025` - Current year tax constants
- `RIGGING_CONSTANTS` - Physical and safety constants
- `STORAGE_KEYS` - Local storage key definitions

## Usage Examples

### Basic Payroll Calculation

```typescript
import { PayrollInputs, DeductionInputs, YTDInputs } from '@/types';

const payrollInputs: PayrollInputs = {
  rate: 60,
  straightTime: 40,
  overtimeHalf: 8,
  overtimeDouble: 0,
  shiftPremium: 1.5,
  travelHours: 0,
  travelRate: 0,
  perDiem: 150,
  days: 5,
  payDate: '2025-01-15',
  frequency: 'weekly',
  province: 'AB',
};
```

### Rigging Calculation

```typescript
import { RiggingInputs } from '@/types';

const riggingInputs: RiggingInputs = {
  hitchType: 'vertical',
  weight: 5000,
  legs: 2,
  angle: 60,
  cogOffset: 0,
  spacing: 2000,
  slingWLL: 4000,
};
```

### Form Validation

```typescript
import { ValidationRules } from '@/types';

const payrollValidation = {
  rate: ValidationRules.required('Base rate is required'),
  straightTime: ValidationRules.range(0, 80, 'Hours must be between 0 and 80'),
  province: ValidationRules.required('Province selection is required'),
};
```

### Error Handling

```typescript
import { AppError, ErrorType } from '@/types';

const handleCalculationError = (error: AppError) => {
  if (error.type === 'CALCULATION_ERROR') {
    // Handle calculation-specific error
    console.error('Calculation failed:', error.message);
  }
};
```

## Type Safety Benefits

1. **Compile-time Error Detection**: Catch type mismatches before runtime
2. **IntelliSense Support**: Rich autocomplete and documentation in IDEs
3. **Refactoring Safety**: Confident code changes with type checking
4. **API Contract Enforcement**: Ensure data structures match expectations
5. **Documentation**: Types serve as living documentation

## Testing

Type definitions are tested in `__tests__/types.test.ts` to ensure:

- All interfaces can be properly instantiated
- Enum values are correctly defined
- Complex nested types work as expected
- Type unions and intersections function properly

Run type tests with:

```bash
npm test -- --testPathPattern=types.test.ts
```

## Contributing

When adding new types:

1. Place them in the appropriate module file
2. Export them from `index.ts`
3. Add comprehensive JSDoc comments
4. Include validation rules if applicable
5. Add test cases to verify the types work correctly
6. Update this README if adding new categories

## Migration Notes

These types replace the implicit typing from the original monolithic component. Key improvements:

- **Explicit Interfaces**: All data structures now have explicit type definitions
- **Enum Safety**: String literals replaced with proper TypeScript enums
- **Validation Integration**: Types include validation rule definitions
- **Error Handling**: Comprehensive error type system
- **Future-Proofing**: Extensible design for new features

The types maintain backward compatibility with existing localStorage data while providing a foundation for future enhancements.