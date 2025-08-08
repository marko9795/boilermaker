# Boilermaker Toolbox - Codebase Documentation

## Overview

The Boilermaker Toolbox is a single-file React application designed specifically for union boilermakers to calculate net pay across complex shifts and perform rigging calculations. The application is built with modern web technologies and focuses on accuracy for Canadian tax calculations and industrial safety requirements.

## Technical Stack

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Storage**: localStorage for persistence
- **Architecture**: Single-file component architecture

## Core Features

### 1. Net Pay Calculator
**Purpose**: Accurate payroll calculations for Canadian boilermakers with complex shift patterns

**Key Capabilities**:
- **2025 Tax Compliance**: Implements current CPP, EI, and federal/provincial tax withholding
- **Multi-Province Support**: Currently supports Alberta with other provinces planned
- **Complex Pay Structures**: 
  - Base rate + shift premiums
  - Straight time, time-and-a-half, double-time calculations
  - Travel time and per diem allowances
- **Year-to-Date Tracking**: Optional YTD inputs to handle CPP/EI maximums
- **Deduction Management**: Union dues, RRSP contributions, other deductions
- **Scenario Saving**: Save and compare different pay scenarios

**Tax Logic (2025 Specific)**:
- CPP: 5.95% to YMPE $71,300 (less $3,500 basic exemption)
- CPP2: 4% from $71,300 to $81,200
- EI: 1.64% to MIE $65,700
- Federal tax: Mid-year rate changes (15% Jan-Jun, 14% Jul-Dec)
- Alberta tax: Prorated rates reflecting legislative changes

### 2. Rigging Calculator
**Purpose**: Safety calculations for lifting operations

**Key Capabilities**:
- **Load Analysis**: Weight distribution across multiple sling legs
- **Angle Factor Calculations**: AF = 1/cos(θ/2) for sling tension
- **Center of Gravity Offset**: Load sharing calculations for off-center picks
- **Safety Margins**: Built-in safety factors for equipment selection
- **Multiple Hitch Types**: Vertical, choker, and basket configurations

### 3. Contract Management
**Purpose**: Store and manage different union contract presets

**Features**:
- Save contract-specific rates and rules
- Quick preset application to calculations
- Local storage persistence

### 4. Scenario Management
**Purpose**: Compare different pay scenarios

**Features**:
- Save calculation results with custom names
- Tabular comparison view
- Local storage persistence

## Code Architecture

### Component Structure
```
BoilermakerToolboxApp (Main App)
├── Header (Navigation)
├── Hero (Landing section)
├── Navigation Pills
├── NetPayCard (Main calculator)
├── RiggingCard (Rigging calculations)
├── ContractsCard (Contract presets)
├── SavedScenarios (Scenario management)
├── SettingsCard (App preferences)
└── Footer
```

### Key State Management
- **Local State**: React useState for form inputs and calculations
- **Computed Values**: useMemo for complex calculations (tax, rigging)
- **Persistence**: localStorage for scenarios and contracts
- **Real-time Updates**: All calculations update live as inputs change

### Utility Functions
- `fmt()`: Currency formatting for Canadian dollars
- `round2()`: Precision rounding for financial calculations
- Tax calculation functions with mid-year rate handling

## Data Models

### Net Pay Calculation Inputs
```typescript
{
  // Pay structure
  rate: number;           // Base hourly rate
  st: number;            // Straight time hours
  ot1: number;           // Time-and-a-half hours
  ot2: number;           // Double-time hours
  shiftPrem: number;     // Shift premium per hour
  
  // Additional earnings
  travelHours: number;
  travelRate: number;
  perDiem: number;       // Daily allowance
  days: number;          // Days for per diem
  
  // Deductions
  unionDuesPct: number;
  rrspPct: number;
  otherDed: number;
  
  // Tax context
  payDate: string;
  freq: 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';
  province: string;
  
  // YTD tracking (optional)
  ytdPensionable: number;
  ytdCPP1: number;
  ytdCPP2: number;
  ytdInsurable: number;
  ytdEI: number;
}
```

### Rigging Calculation Inputs
```typescript
{
  hitch: 'vertical' | 'choker' | 'basket';
  weight: number;        // Load weight in kg
  legs: number;          // Number of sling legs
  angle: number;         // Included angle at hook
  cogOffset: number;     // Center of gravity offset
  spacing: number;       // Pick point spacing
  slingWLL: number;      // Sling working load limit
}
```

## Current Strengths

1. **Accuracy**: Implements current 2025 Canadian tax rules with mid-year changes
2. **User Experience**: Clean, industrial-themed UI with real-time calculations
3. **Industry-Specific**: Built specifically for boilermaker workflows
4. **Comprehensive**: Covers both payroll and safety calculations
5. **Responsive**: Works across different screen sizes
6. **Performance**: Efficient calculations with proper memoization

## Current Limitations

1. **Single File**: All code in one 1000+ line file
2. **Limited Province Support**: Only Alberta fully implemented
3. **Basic Rigging**: Missing advanced rigging factors (choker/basket multipliers)
4. **No Backend**: All data stored locally
5. **Limited Testing**: No automated tests
6. **No Build Process**: Single JSX file without proper build pipeline
7. **Accessibility**: Limited accessibility features
8. **Error Handling**: Minimal error handling and validation

## File Structure
```
.
└── boilermaker_toolbox_front_end_2025_tax_logic_wired.jsx (1,081 lines)
```

## Dependencies
- React
- Framer Motion
- Lucide React
- Tailwind CSS (assumed via CDN or external setup)

## Browser Compatibility
- Modern browsers supporting ES6+ features
- localStorage support required for persistence features