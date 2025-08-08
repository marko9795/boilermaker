# Requirements Document

## Introduction

This specification outlines the requirements for refactoring the Boilermaker Toolbox from a single 1,081-line JSX file into a maintainable, testable, and scalable React application architecture. The refactoring must preserve all existing functionality while establishing a foundation for future enhancements.

## Requirements

### Requirement 1: Project Structure and Build System

**User Story:** As a developer, I want a proper project structure with modern build tooling, so that I can efficiently develop, test, and deploy the application.

#### Acceptance Criteria

1. WHEN setting up the project THEN the system SHALL create a standard React project structure with separate directories for components, hooks, utils, and tests
2. WHEN configuring the build system THEN the system SHALL use Vite as the build tool for fast development and optimized production builds
3. WHEN managing dependencies THEN the system SHALL create a package.json with all required dependencies properly versioned
4. WHEN developing THEN the system SHALL support hot module replacement for instant feedback during development
5. WHEN building for production THEN the system SHALL generate optimized, minified bundles with proper asset handling

### Requirement 2: Component Architecture Separation

**User Story:** As a developer, I want the monolithic component broken down into logical, reusable components, so that the codebase is maintainable and follows React best practices.

#### Acceptance Criteria

1. WHEN refactoring the main component THEN the system SHALL separate the BoilermakerToolboxApp into distinct feature components (NetPayCalculator, RiggingCalculator, ContractManager, ScenarioManager)
2. WHEN creating UI components THEN the system SHALL extract reusable components (Card, Field, Input, NumberInput, Select, KPI) into a shared components directory
3. WHEN organizing components THEN the system SHALL follow a consistent file naming convention and directory structure
4. WHEN implementing components THEN each component SHALL have a single responsibility and clear props interface
5. WHEN nesting components THEN the system SHALL maintain a maximum component depth of 3 levels to avoid over-nesting

### Requirement 3: Business Logic Extraction

**User Story:** As a developer, I want business logic separated from UI components, so that calculations can be tested independently and reused across components.

#### Acceptance Criteria

1. WHEN extracting tax calculations THEN the system SHALL create pure functions for CPP, EI, and income tax calculations in separate utility modules
2. WHEN extracting rigging calculations THEN the system SHALL create pure functions for angle factors, load distribution, and safety calculations
3. WHEN implementing calculation functions THEN each function SHALL accept inputs as parameters and return calculated values without side effects
4. WHEN organizing business logic THEN the system SHALL group related calculations into logical modules (taxCalculations.ts, riggingCalculations.ts, payrollCalculations.ts)
5. WHEN using calculations in components THEN the system SHALL use custom hooks to manage calculation state and side effects

### Requirement 4: TypeScript Implementation

**User Story:** As a developer, I want proper TypeScript interfaces and type safety, so that I can catch errors at compile time and have better code documentation.

#### Acceptance Criteria

1. WHEN defining data structures THEN the system SHALL create TypeScript interfaces for all major data types (PayrollInputs, RiggingInputs, TaxResults, etc.)
2. WHEN implementing components THEN the system SHALL use proper TypeScript props interfaces with required and optional properties
3. WHEN writing functions THEN the system SHALL include proper parameter and return type annotations
4. WHEN configuring TypeScript THEN the system SHALL use strict mode to enforce type safety
5. WHEN handling form inputs THEN the system SHALL use proper type guards and validation for user input

### Requirement 5: Testing Infrastructure

**User Story:** As a developer, I want comprehensive testing capabilities, so that I can ensure calculation accuracy and prevent regressions.

#### Acceptance Criteria

1. WHEN setting up testing THEN the system SHALL configure Jest and React Testing Library for unit and integration testing
2. WHEN testing calculations THEN the system SHALL create unit tests for all tax and rigging calculation functions with known input/output pairs
3. WHEN testing components THEN the system SHALL create tests for user interactions, form submissions, and state changes
4. WHEN running tests THEN the system SHALL achieve minimum 80% code coverage for business logic functions
5. WHEN implementing CI/CD THEN the system SHALL run tests automatically on code changes and prevent deployment of failing tests

### Requirement 6: Error Handling and Validation

**User Story:** As a user, I want proper error handling and input validation, so that I receive clear feedback when something goes wrong and cannot enter invalid data.

#### Acceptance Criteria

1. WHEN entering invalid input THEN the system SHALL display clear, user-friendly error messages
2. WHEN calculations fail THEN the system SHALL gracefully handle errors without crashing the application
3. WHEN validating forms THEN the system SHALL prevent submission of incomplete or invalid data
4. WHEN handling runtime errors THEN the system SHALL implement error boundaries to contain failures
5. WHEN logging errors THEN the system SHALL provide meaningful error information for debugging

### Requirement 7: State Management Architecture

**User Story:** As a developer, I want a clear state management pattern, so that application state is predictable and easy to debug.

#### Acceptance Criteria

1. WHEN managing local component state THEN the system SHALL use React useState for simple component-specific state
2. WHEN sharing state between components THEN the system SHALL use React Context or custom hooks for cross-component state
3. WHEN managing form state THEN the system SHALL implement proper form state management with validation
4. WHEN persisting data THEN the system SHALL abstract localStorage operations into custom hooks
5. WHEN updating state THEN the system SHALL ensure state updates are immutable and predictable

### Requirement 8: Version Control and Development Workflow

**User Story:** As a developer, I want proper Git version control and automated code quality tools, so that I can track changes, collaborate effectively, and maintain code quality.

#### Acceptance Criteria

1. WHEN initializing the project THEN the system SHALL set up Git repository with proper .gitignore for Node.js/React projects
2. WHEN writing code THEN the system SHALL enforce consistent formatting using Prettier
3. WHEN committing code THEN the system SHALL run ESLint to catch potential issues and enforce coding standards
4. WHEN making commits THEN the system SHALL run pre-commit hooks to ensure code quality and run tests
5. WHEN managing branches THEN the system SHALL follow Git flow with feature branches for development
6. WHEN reviewing code THEN the system SHALL provide clear component documentation and prop interfaces
7. WHEN developing THEN the system SHALL support debugging with proper source maps and development tools

### Requirement 9: Performance and Optimization

**User Story:** As a user, I want the application to load quickly and respond immediately to my inputs, so that I can work efficiently.

#### Acceptance Criteria

1. WHEN loading the application THEN the system SHALL achieve initial load time under 2 seconds on standard broadband
2. WHEN performing calculations THEN the system SHALL update results in real-time without noticeable delay
3. WHEN optimizing renders THEN the system SHALL use React.memo and useMemo appropriately to prevent unnecessary re-renders
4. WHEN bundling code THEN the system SHALL implement code splitting for optimal loading performance
5. WHEN caching calculations THEN the system SHALL memoize expensive calculations to improve responsiveness

### Requirement 10: Backward Compatibility and Migration

**User Story:** As a user, I want all existing functionality to work exactly as before, so that the refactoring doesn't disrupt my workflow.

#### Acceptance Criteria

1. WHEN using the net pay calculator THEN the system SHALL produce identical results to the original implementation
2. WHEN using the rigging calculator THEN the system SHALL maintain the same calculation accuracy and behavior
3. WHEN loading saved scenarios THEN the system SHALL successfully import existing localStorage data
4. WHEN using contract presets THEN the system SHALL maintain compatibility with existing saved contracts
5. WHEN navigating the interface THEN the system SHALL preserve the same user experience and visual design