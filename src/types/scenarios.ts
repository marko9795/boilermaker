/**
 * Scenario management types and interfaces
 */

import { PayrollScenario } from './payroll';
import { RiggingScenario } from './rigging';
import { ScenarioType } from './common';

// Union type for all scenario types
export type Scenario = PayrollScenario | RiggingScenario;

// Scenario comparison data
export interface ScenarioComparison {
  scenarios: Scenario[];
  comparisonType: 'netpay' | 'rigging';
  comparedAt: number;
}

// Scenario search and filter options
export interface ScenarioFilters {
  // Text search
  searchTerm?: string;
  
  // Type filter
  type?: ScenarioType;
  
  // Date filters
  dateFrom?: string;
  dateTo?: string;
  
  // Value filters (for net pay scenarios)
  minNetPay?: number;
  maxNetPay?: number;
  
  // Value filters (for rigging scenarios)
  minWeight?: number;
  maxWeight?: number;
}

// Scenario sorting options
export type ScenarioSortField = 
  | 'name'
  | 'ts'
  | 'type'
  | 'netPay'
  | 'weight';

export type ScenarioSortOrder = 'asc' | 'desc';

export interface ScenarioSort {
  field: ScenarioSortField;
  order: ScenarioSortOrder;
}

// Scenario statistics
export interface ScenarioStats {
  total: number;
  byType: Record<ScenarioType, number>;
  recentCount: number;
  averageNetPay?: number;
  averageWeight?: number;
}

// Scenario export data
export interface ScenarioExportData {
  version: string;
  exportDate: string;
  scenarios: Scenario[];
}

// Scenario import result
export interface ScenarioImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
}

// Scenario validation result
export interface ScenarioValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Scenario table column configuration
export interface ScenarioTableColumn {
  key: string;
  label: string;
  sortable: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
}

// Scenario action types
export type ScenarioAction = 
  | 'view'
  | 'edit'
  | 'duplicate'
  | 'delete'
  | 'export'
  | 'compare';

// Scenario bulk operations
export interface ScenarioBulkOperation {
  action: 'delete' | 'export';
  scenarioIds: string[];
}

// Scenario pagination
export interface ScenarioPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Scenario list view configuration
export interface ScenarioListConfig {
  filters: ScenarioFilters;
  sort: ScenarioSort;
  pagination: ScenarioPagination;
  selectedIds: string[];
}

// Scenario detail view data
export interface ScenarioDetailView {
  scenario: Scenario;
  relatedScenarios: Scenario[];
  comparisonData?: ScenarioComparison;
}