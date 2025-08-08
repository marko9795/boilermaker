# Design Document

## Overview

This design document outlines the architectural transformation of the Boilermaker Toolbox from a monolithic 1,081-line React component into a modular, maintainable, and testable application. The design prioritizes separation of concerns, type safety, testability, and developer experience while preserving all existing functionality.

## Architecture

### High-Level Architecture

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI primitives
│   └── forms/           # Form-specific components
├── features/            # Feature-specific components and logic
│   ├── netpay/         # Net pay calculator feature
│   ├── rigging/        # Rigging calculator feature
│   ├── contracts/      # Contract management feature
│   └── scenarios/      # Scenario management feature
├── hooks/              # Custom React hooks
├── utils/              # Pure utility functions
│   ├── calculations/   # Business logic calculations
│   └── helpers/        # General helper functions
├── types/              # TypeScript type definitions
├── constants/          # Application constants
└── __tests__/          # Test files
```

### Component Hierarchy

```
App
├── Header
├── Hero
├── Navigation
└── Router
    ├── NetPayFeature
    │   ├── NetPayCalculator
    │   ├── PayrollInputForm
    │   ├── DeductionsForm
    │   ├── YTDForm
    │   └── ResultsDisplay
    ├── RiggingFeature
    │   ├── RiggingCalculator
    │   ├── RiggingInputForm
    │   └── RiggingResults
    ├── ContractsFeature
    │   ├── ContractManager
    │   ├── ContractForm
    │   └── ContractList
    └── ScenariosFeature
        ├── ScenarioManager
        └── ScenarioTable
```

## Components and Interfaces

### Core Type Definitions

```typescript
// types/payroll.ts
export interface PayrollInputs {
  rate: number;
  straightTime: number;
  overtimeHalf: number;
  overtimeDouble: number;
  shiftPremium: number;
  travelHours: number;
  travelRate: number;
  perDiem: number;
  days: number;
  payDate: string;
  frequency: PayFrequency;
  province: Province;
}

export interface DeductionInputs {
  unionDuesPercent: number;
  rrspPercent: number;
  rrspAtSource: boolean;
  otherDeductions: number;
}

export interface YTDInputs {
  pensionableEarnings: number;
  cpp1Paid: number;
  cpp2Paid: number;
  insurableEarnings: number;
  eiPaid: number;
}

export interface PayrollResults {
  gross: GrossPayBreakdown;
  deductions: DeductionBreakdown;
  net: number;
}

// types/rigging.ts
export interface RiggingInputs {
  hitchType: HitchType;
  weight: number;
  legs: number;
  angle: number;
  cogOffset: number;
  spacing: number;
  slingWLL: number;
}

export interface RiggingResults {
  angleFactor: number;
  tensionPerLeg: number;
  minRequiredWLL: number;
  safetyCheck: boolean;
}
```

### Business Logic Layer

```typescript
// utils/calculations/taxCalculations.ts
export const calculateCPP = (
  pensionableEarnings: number,
  ytdPensionable: number,
  periodsPerYear: number
): CPPResult => {
  // Pure function implementation
};

export const calculateEI = (
  insurableEarnings: number,
  ytdInsurable: number,
  periodsPerYear: number
): EIResult => {
  // Pure function implementation
};

export const calculateIncomeTax = (
  taxableIncome: number,
  payDate: string,
  province: Province,
  periodsPerYear: number
): TaxResult => {
  // Pure function implementation
};

// utils/calculations/riggingCalculations.ts
export const calculateAngleFactor = (angle: number): number => {
  const theta = (angle / 2) * (Math.PI / 180);
  return 1 / Math.cos(theta);
};

export const calculateLoadDistribution = (
  weight: number,
  legs: number,
  cogOffset: number,
  spacing: number
): LoadDistribution => {
  // Pure function implementation
};
```

### Custom Hooks Layer

```typescript
// hooks/usePayrollCalculation.ts
export const usePayrollCalculation = (
  payrollInputs: PayrollInputs,
  deductionInputs: DeductionInputs,
  ytdInputs: YTDInputs
) => {
  const results = useMemo(() => {
    // Orchestrate calculation functions
    const gross = calculateGrossPay(payrollInputs);
    const cpp = calculateCPP(gross.wage, ytdInputs.pensionableEarnings, periodsPerYear);
    const ei = calculateEI(gross.wage, ytdInputs.insurableEarnings, periodsPerYear);
    const tax = calculateIncomeTax(gross.wage, payrollInputs.payDate, payrollInputs.province, periodsPerYear);
    
    return {
      gross,
      deductions: { cpp, ei, tax, ...otherDeductions },
      net: gross.total - totalDeductions
    };
  }, [payrollInputs, deductionInputs, ytdInputs]);

  return results;
};

// hooks/useRiggingCalculation.ts
export const useRiggingCalculation = (inputs: RiggingInputs) => {
  const results = useMemo(() => {
    const angleFactor = calculateAngleFactor(inputs.angle);
    const loadDistribution = calculateLoadDistribution(
      inputs.weight,
      inputs.legs,
      inputs.cogOffset,
      inputs.spacing
    );
    
    return {
      angleFactor,
      tensionPerLeg: loadDistribution.maxTension / 1000,
      minRequiredWLL: (loadDistribution.maxTension / 9.80665) * 1.25,
      safetyCheck: inputs.slingWLL >= minRequiredWLL
    };
  }, [inputs]);

  return results;
};

// hooks/useLocalStorage.ts
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};
```

### Component Layer

```typescript
// features/netpay/NetPayCalculator.tsx
export const NetPayCalculator: React.FC = () => {
  const [payrollInputs, setPayrollInputs] = useState<PayrollInputs>(defaultPayrollInputs);
  const [deductionInputs, setDeductionInputs] = useState<DeductionInputs>(defaultDeductionInputs);
  const [ytdInputs, setYTDInputs] = useState<YTDInputs>(defaultYTDInputs);
  
  const results = usePayrollCalculation(payrollInputs, deductionInputs, ytdInputs);
  const [scenarios, saveScenario] = useScenarios();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card title="Net Pay Calculator" icon={<Wallet className="h-5 w-5" />}>
          <PayrollInputForm 
            inputs={payrollInputs} 
            onChange={setPayrollInputs} 
          />
          <DeductionsForm 
            inputs={deductionInputs} 
            onChange={setDeductionInputs} 
          />
          <YTDForm 
            inputs={ytdInputs} 
            onChange={setYTDInputs} 
          />
          <ResultsDisplay results={results} />
          <ScenarioSaver 
            results={results} 
            onSave={saveScenario} 
          />
        </Card>
      </div>
      <div className="lg:col-span-1">
        <QuickPresets onApply={setPayrollInputs} />
        <TaxLogicInfo />
      </div>
    </div>
  );
};

// components/ui/Card.tsx
interface CardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, icon, children, className = "" }) => {
  return (
    <section className={`rounded-2xl border border-neutral-800 bg-neutral-950 p-5 shadow-lg shadow-black/30 ${className}`}>
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
};
```

## Data Models

### State Management Strategy

1. **Local Component State**: Use `useState` for component-specific UI state
2. **Shared State**: Use React Context for cross-component state (theme, user preferences)
3. **Calculated State**: Use `useMemo` for derived calculations
4. **Persistent State**: Use custom `useLocalStorage` hook for data persistence
5. **Form State**: Use controlled components with validation

### Data Flow Architecture

```
User Input → Form Components → State Updates → Custom Hooks → Calculation Functions → Results Display
                                     ↓
                              Local Storage ← Persistence Hooks
```

## Error Handling

### Error Boundary Implementation

```typescript
// components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service in production
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

### Input Validation Strategy

```typescript
// utils/validation.ts
export const validatePayrollInputs = (inputs: PayrollInputs): ValidationResult => {
  const errors: ValidationError[] = [];
  
  if (inputs.rate <= 0) {
    errors.push({ field: 'rate', message: 'Base rate must be greater than 0' });
  }
  
  if (inputs.straightTime < 0) {
    errors.push({ field: 'straightTime', message: 'Hours cannot be negative' });
  }
  
  // Additional validation rules...
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

## Testing Strategy

### Unit Testing Approach

```typescript
// __tests__/utils/taxCalculations.test.ts
describe('Tax Calculations', () => {
  describe('calculateCPP', () => {
    it('should calculate CPP correctly for standard case', () => {
      const result = calculateCPP(5000, 0, 52);
      expect(result.cpp1).toBeCloseTo(297.5, 2);
      expect(result.cpp2).toBe(0);
    });

    it('should handle CPP maximum correctly', () => {
      const result = calculateCPP(80000, 60000, 52);
      expect(result.cpp1).toBeCloseTo(0, 2); // Should be capped
    });

    it('should calculate CPP2 for high earners', () => {
      const result = calculateCPP(85000, 0, 52);
      expect(result.cpp2).toBeGreaterThan(0);
    });
  });
});

// __tests__/components/NetPayCalculator.test.tsx
describe('NetPayCalculator', () => {
  it('should render all input fields', () => {
    render(<NetPayCalculator />);
    
    expect(screen.getByLabelText(/base rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/straight time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/overtime/i)).toBeInTheDocument();
  });

  it('should update calculations when inputs change', async () => {
    render(<NetPayCalculator />);
    
    const rateInput = screen.getByLabelText(/base rate/i);
    await user.type(rateInput, '65');
    
    // Verify calculations update
    expect(screen.getByText(/gross/i)).toBeInTheDocument();
  });
});
```

### Integration Testing

```typescript
// __tests__/integration/payrollFlow.test.tsx
describe('Payroll Calculation Flow', () => {
  it('should complete full payroll calculation workflow', async () => {
    render(<App />);
    
    // Navigate to net pay calculator
    await user.click(screen.getByText(/net pay/i));
    
    // Fill in form
    await user.type(screen.getByLabelText(/base rate/i), '60');
    await user.type(screen.getByLabelText(/straight time/i), '40');
    
    // Verify results appear
    expect(screen.getByText(/net.*est/i)).toBeInTheDocument();
    
    // Save scenario
    await user.type(screen.getByLabelText(/scenario name/i), 'Test Scenario');
    await user.click(screen.getByText(/save scenario/i));
    
    // Verify scenario saved
    expect(screen.getByText(/scenario saved/i)).toBeInTheDocument();
  });
});
```

## Performance Considerations

### Optimization Strategies

1. **Memoization**: Use `React.memo` for expensive components and `useMemo` for calculations
2. **Code Splitting**: Implement lazy loading for feature components
3. **Bundle Optimization**: Use Vite's built-in optimizations and tree shaking
4. **Calculation Caching**: Cache expensive tax calculations with stable inputs

### Bundle Size Management

```typescript
// Lazy loading implementation
const NetPayCalculator = lazy(() => import('./features/netpay/NetPayCalculator'));
const RiggingCalculator = lazy(() => import('./features/rigging/RiggingCalculator'));

// In App component
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/netpay" element={<NetPayCalculator />} />
    <Route path="/rigging" element={<RiggingCalculator />} />
  </Routes>
</Suspense>
```

## Migration Strategy

### Backward Compatibility

1. **Data Migration**: Ensure existing localStorage data remains compatible
2. **API Preservation**: Maintain identical calculation results
3. **UI Consistency**: Preserve existing user interface and workflows
4. **Gradual Migration**: Implement feature-by-feature migration approach

### Deployment Strategy

1. **Development Environment**: Set up local development with hot reloading
2. **Testing Environment**: Automated testing pipeline with CI/CD
3. **Staging Environment**: Pre-production testing with production data
4. **Production Deployment**: Blue-green deployment with rollback capability

This design provides a solid foundation for transforming the monolithic application into a maintainable, scalable, and testable codebase while preserving all existing functionality.