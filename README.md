# Boilermaker Toolbox

A modern React application for payroll and rigging calculations, refactored from a monolithic component into a maintainable, testable architecture.

## 🚀 Recent Updates

### ✅ Task 6 Completed - UI Component Library
- **57 reusable UI components** built with TypeScript and accessibility features
- **Comprehensive test coverage** with all tests passing
- **WCAG compliant** with ARIA attributes, keyboard navigation, and screen reader support
- **Dark theme ready** with consistent styling using Tailwind CSS

**Components Available:**
- **UI Primitives:** Card, Button, Input, NumberInput, Select, Field, KPI, Separator, Breakdown
- **Form Components:** FormInput, FormNumberInput, FormSelect, FormSection, FormErrors, PresetButton, QuickActions
- **Accessibility:** ScreenReaderOnly, LiveRegion, FocusTrap

See `TASK_6_COMPLETION_NOTES.md` for detailed implementation notes.

## Features

- **Net Pay Calculator**: Calculate take-home pay with Canadian tax calculations (CPP, EI, federal and provincial taxes)
- **Rigging Calculator**: Calculate load distributions, angle factors, and safety requirements for lifting operations
- **Contract Management**: Save and manage contract presets
- **Scenario Management**: Save and compare calculation scenarios

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Jest** and React Testing Library for testing
- **ESLint** and Prettier for code quality
- **Husky** for pre-commit hooks

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building

Build for production:
```bash
npm run build
```

### Testing

Run tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

### Code Quality

Lint code:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```

Format code:
```bash
npm run format
```

Check formatting:
```bash
npm run format:check
```

## Project Structure

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

## Development Workflow

This project uses:
- **Pre-commit hooks** to ensure code quality
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Jest** for unit and integration testing

All commits are automatically checked for:
- Linting errors
- Formatting consistency
- Test failures

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass
4. Ensure code is properly formatted and linted
5. Submit a pull request

## License

This project is private and proprietary.