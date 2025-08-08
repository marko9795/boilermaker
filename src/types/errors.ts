/**
 * Error handling types and interfaces
 */

// Base error interface
export interface BaseError {
  message: string;
  code?: string;
  timestamp: number;
}

// Application error types
export type ErrorType = 
  | 'VALIDATION_ERROR'
  | 'CALCULATION_ERROR'
  | 'STORAGE_ERROR'
  | 'NETWORK_ERROR'
  | 'PERMISSION_ERROR'
  | 'UNKNOWN_ERROR';

// Application error interface
export interface AppError extends BaseError {
  type: ErrorType;
  details?: Record<string, any>;
  stack?: string;
}

// Validation error details
export interface ValidationErrorDetails {
  field: string;
  value: any;
  constraint: string;
  message: string;
}

// Calculation error details
export interface CalculationErrorDetails {
  operation: string;
  inputs: Record<string, any>;
  expectedRange?: {
    min?: number;
    max?: number;
  };
}

// Storage error details
export interface StorageErrorDetails {
  operation: 'read' | 'write' | 'delete';
  key: string;
  storageType: 'localStorage' | 'sessionStorage';
}

// Network error details
export interface NetworkErrorDetails {
  url: string;
  method: string;
  status?: number;
  statusText?: string;
}

// Error boundary state
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// Error recovery options
export interface ErrorRecoveryOptions {
  retry?: () => void;
  fallback?: () => void;
  reset?: () => void;
  contact?: () => void;
}

// Error reporting data
export interface ErrorReport {
  error: AppError;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  additionalContext?: Record<string, any>;
}

// Error handler configuration
export interface ErrorHandlerConfig {
  enableReporting: boolean;
  enableConsoleLogging: boolean;
  enableUserNotification: boolean;
  reportingEndpoint?: string;
  maxRetries: number;
  retryDelay: number;
}

// Error context for React Error Boundary
export interface ErrorContextValue {
  reportError: (error: AppError) => void;
  clearError: () => void;
  retryLastAction: () => void;
  currentError: AppError | null;
}

// Form validation error
export interface FormValidationError extends BaseError {
  field: string;
  value: any;
  rule: string;
}

// Async operation error
export interface AsyncOperationError extends BaseError {
  operation: string;
  retryable: boolean;
  retryCount: number;
  maxRetries: number;
}

// Error severity levels
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

// Enhanced error interface with severity
export interface EnhancedError extends AppError {
  severity: ErrorSeverity;
  category: string;
  recoverable: boolean;
  userMessage: string;
  technicalMessage: string;
}

// Error logging interface
export interface ErrorLogger {
  log: (error: AppError) => void;
  warn: (message: string, context?: any) => void;
  info: (message: string, context?: any) => void;
  debug: (message: string, context?: any) => void;
}

// Error metrics
export interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Record<ErrorType, number>;
  errorsBySeverity: Record<ErrorSeverity, number>;
  recentErrors: AppError[];
  errorRate: number;
  meanTimeToRecovery: number;
}